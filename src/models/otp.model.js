import moongoose from "mongoose";

const otpSchema = new moongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is required"]
    },
    user:{
        type: moongoose.Schema.Types.ObjectId,
        ref: "User",
        required:[true, "User is required"]
    },
    otpHash:{
        type:String,
        required:[true, "OTP Hash is required"]
    }
},{
     timestamps:true
})

const otpModel = moongoose.model("Otp", otpSchema)

export default otpModel