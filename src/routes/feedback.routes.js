import express from "express";
import { giveFeedback } from "../controllers/feedback.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const feedbackRouter = express.Router();

feedbackRouter.post(
    "/:messageId",
    authMiddleware,
    giveFeedback
);

export default feedbackRouter;