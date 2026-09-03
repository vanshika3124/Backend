import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access token not found"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        req.user = {
            _id: decoded.id
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        });
    }
}