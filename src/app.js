import express from "express";

import morgan from "morgan";

import authRouter from "./routes/auth.routes.js";

import cookieParser from "cookie-parser";

import conversationRouter from "./routes/conversation.routes.js";

import chatRouter from "./routes/chat.routes.js";

import feedbackRouter from "./routes/feedback.routes.js";

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use(cookieParser());

app.use("/api/conversations", conversationRouter);

app.use("/api/auth", authRouter);

app.use("/api/chat", chatRouter);

app.use("/api/feedback", feedbackRouter);

export default app;