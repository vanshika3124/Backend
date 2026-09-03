import express from "express";

import {
    createConversation,
    getConversations,
    getMessages
} from "../controllers/conversation.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const conversationRouter = express.Router();

conversationRouter.post(
    "/",
    authMiddleware,
    createConversation
);

conversationRouter.get(
    "/",
    authMiddleware,
    getConversations
);

conversationRouter.get(
    "/:conversationId/messages",
    authMiddleware,
    getMessages
);

export default conversationRouter;