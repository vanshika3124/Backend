import axios from "axios";

const ML_API_URL = "https://sih2026-prototype.onrender.com/chat";

export async function askML(question) {
    try {
        const response = await axios.post(
            ML_API_URL,
            {
                question
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 60000
            }
        );

        return {
            answer: response.data.answer,
            sources: response.data.sources || []
        };

    } catch (error) {
        console.error(
            "ML API error:",
            error.response?.data || error.message
        );

        throw new Error("ML service failed");
    }
}