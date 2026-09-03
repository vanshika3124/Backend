import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";



export async function createConversation(req, res) {
    try {
        const conversation = await conversationModel.create({
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            conversation
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create conversation"
        });
    }
}

export async function getConversations(req, res) {
    try {
        const conversations = await conversationModel
            .find({ user: req.user._id })
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            conversations
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch conversations"
        });
    }
}

export async function getMessages(req, res) {
    try {
        const { conversationId } = req.params;

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

        const messages = await messageModel
            .find({ conversation: conversationId })
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
}