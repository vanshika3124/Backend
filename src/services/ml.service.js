import axios from "axios";

const ML_API_URL = process.env.ML_API_URL;

export async function askML(question) {
    try {
        console.log("ML URL:", ML_API_URL);
        console.log("Sending question:", question);

        const { data } = await axios.post(
            `${ML_API_URL}/chat`,
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

        console.log("ML RESPONSE:", data);

        return data;

    }  catch (error) {
    console.error("========== ML ERROR ==========");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    console.error("URL:", `${ML_API_URL}/chat`);
    console.error("================================");

    throw error;
}
}