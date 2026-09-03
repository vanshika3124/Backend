import messageModel from "../models/message.model.js";

export async function giveFeedback(req, res) {
    try {
        const { messageId } = req.params;
        const { feedback } = req.body;

        if (!["up", "down"].includes(feedback)) {
            return res.status(400).json({
                success: false,
                message: "Feedback must be 'up' or 'down'"
            });
        }

        const message = await messageModel.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        if (message.role !== "assistant") {
            return res.status(400).json({
                success: false,
                message: "Feedback can only be given to assistant messages"
            });
        }

        message.feedback = feedback;
        await message.save();

        res.status(200).json({
            success: true,
            message: "Feedback submitted successfully",
            feedback: message.feedback
        });

    } catch (error) {
        console.error("Feedback error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit feedback"
        });
    }
}