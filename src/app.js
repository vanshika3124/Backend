import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import conversationRouter from "./routes/conversation.routes.js";
import chatRouter from "./routes/chat.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";

const app = express();

// ==================== CORS ====================
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// ==================== ROUTES ====================
app.use("/api/conversations", conversationRouter);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/feedback", feedbackRouter);

export default app;