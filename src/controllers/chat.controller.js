import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";
import { askML } from "../services/ml.service.js";

export async function chat(req, res) {
    try {
        const { conversationId, question } = req.body;

        if (!conversationId || !question) {
            return res.status(400).json({
                success: false,
                message: "conversationId and question are required"
            });
        }

        // Check whether conversation belongs to logged-in user
        const conversation = await conversationModel.findOne({
            _id: conversationId,
            user: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // Save user's message
        const userMessage = await messageModel.create({
            conversation: conversationId,
            role: "user",
            content: question
        });

        // Set conversation title from the first user question
if (conversation.title === "New Conversation") {
    conversation.title =
        question.length > 40
            ? question.substring(0, 40) + "..."
            : question;
}

        // Get response from ML service
        const result = await askML(question);

        // Save AI response
        const assistantMessage = await messageModel.create({
            conversation: conversationId,
            role: "assistant",
            content: result.answer
        });

        // Update conversation timestamp
        conversation.updatedAt = new Date();
        await conversation.save();

        res.status(200).json({
            success: true,
            answer: result.answer,
            userMessage,
            assistantMessage
        });

    } catch (error) {
        console.error("Chat error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to process chat"
        });
    }
}