import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async (to, subject, text, html) => {
    try {
        const response = await axios.post(
            BREVO_API_URL,
            {
                sender: {
                    name: "BIS Sahayak",
                    email: process.env.BREVO_SENDER_EMAIL
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject: subject,
                textContent: text || "Your OTP is included in the email.",
                htmlContent: html || `<p>${text || ""}</p>`
            },
            {
                headers: {
                    accept: "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json"
                },
                timeout: 15000
            }
        );

        console.log(
            "Email sent successfully:",
            response.data.messageId
        );

        return response.data;

    } catch (error) {
        console.error(
            "Brevo email error:",
            error.response?.data || error.message
        );

        throw error;
    }
};