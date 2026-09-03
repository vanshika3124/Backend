import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";

export async function register(req, res) {


    const { username, email, password } = req.body;

    const isAlreadyRegistered = await userModel.findOne({  
        $or:[
            {username},
            {email}
        ]
     });

     if(isAlreadyRegistered){
        return res.status(409).json({
            message:"User already exists"
        })
     }

     const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

     const user = await userModel.create({
        username,
        email,
        password:hashedPassword
     })

     const otp = generateOtp();
     const html = getOtpHtml(otp);

      
     const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

     await otpModel.create({
        email,
        user: user._id,
        otpHash
     });
    
     await sendEmail(email, "OTP Verification", null, html);

    res.status(201).json({
        message:"User registered successfully",
        user:{
            username: user.username,
            email: user.email,
            verified: user.verified
        } 
        
    })


}

export async function login(req,res){

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if(!user){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }
    
    if(!user.verified){
        return res.status(401).json({
            message:"User is not verified"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const isPasswordValid = hashedPassword === user.password;

    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }

    const refreshToken = jwt.sign({
        id:user._id
     },config.JWT_SECRET, 
     {
        expiresIn:"7d"
     })

     const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

     const session = await sessionModel.create({
        userId: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
     })

     
     const accessToken = jwt.sign({
        id:user._id,
        sessionId: session._id
     },config.JWT_SECRET, {
        expiresIn:"15m"
     })

     
     res.cookie("refreshToken", refreshToken,{
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000
     })
    
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            username: user.username,
            email: user.email
        },
            accessToken,
        
    })

}

export async function getMe(req,res){

    const token = req.headers.authorization?.split(" ")[ 1 ];

    if(!token){
        return res.status(401).json({
            message:"token not found"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)

    console.log(decoded)

    const user = await userModel.findById(decoded.id)

    res.status(200).json({
        message: "user fetched successfully",
        user:{
            username: user.username,
            email: user.email
        }
    })
}

export async function refreshToken(req,res){

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message: "Refresh Token not found"
        })
    }


    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if(!session){
        return res.status(401).json({
            message: "Invalid Refresh Token"
        })
    }

    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    })

    const newrefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
    {
        expiresIn: "7d"
    }
)

const newRefreshTokenHash = crypto.createHash("sha256").update(newrefreshToken).digest("hex");

session.refreshTokenHash = newRefreshTokenHash;
await session.save();

    res.cookie("refreshToken", newrefreshToken,{
        httpOnly: true,
        secure: true,
        sameSite:"strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Access Token Refreshed successfully",
        accessToken
    })
}

export async function logout(req,res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh Token not found"
        })
    }

   const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

   const session = await sessionModel.findOne({ 
    refreshTokenHash,
    revoked: false
 })

 if(!session){
    return res.status(400).json({
        message: "Invalid Refresh Token"
    })
 }

 session.revoked = true;
 await session.save();

 res.clearCookie("refreshToken");

 res.status(200).json({
    message:"Logged out successfully"
 })
}

export async function logoutAll(req,res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh Token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    await sessionModel.updateMany({
        userId: decoded.id,
        revoked: false
    },{
        revoked: true
    })

    res.status(200).json({
        message: "Logged out from all devices successfully"
    })

}

export async function verifyEmail(req, res) {
    try {
        // Support both:
        // POST -> req.body
        // GET  -> req.query

        const email = req.body?.email || req.query?.email;
        const otp = req.body?.otp || req.query?.otp;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const otpHash = crypto
            .createHash("sha256")
            .update(String(otp))
            .digest("hex");

        const otpDoc = await otpModel.findOne({
            email,
            otpHash
        });

        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        const user = await userModel.findByIdAndUpdate(
            otpDoc.user,
            {
                verified: true
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await otpModel.deleteMany({
            user: otpDoc.user
        });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        });

    } catch (error) {
        console.error("Verify email error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to verify email"
        });
    }
}
