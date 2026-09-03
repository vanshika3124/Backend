import express from "express";

import { chat } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.post(
    "/",
    authMiddleware,
    chat
);

export default chatRouter;