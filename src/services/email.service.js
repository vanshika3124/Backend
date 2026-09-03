import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "BIS Assistant <onboarding@resend.dev>",
            to,
            subject,
            text,
            html
        });

        if (error) {
            console.error("Error sending email:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully:", data);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};