import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    },

    family: 4
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"BIS Sahayak" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });

        console.log("Email sent successfully:", info.messageId);

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};