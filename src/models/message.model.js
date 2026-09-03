import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },

        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true
        },

        feedback: {
    type: String,
    enum: ["up", "down", null],
    default: null
},

        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const messageModel = mongoose.model(
    "Message",
    messageSchema
);

export default messageModel;