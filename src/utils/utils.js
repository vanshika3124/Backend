export function generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

export function getOtpHtml(otp) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin-top: 50px;
                }
            </style>
        </head>
        <body>
            <h1>OTP Verification</h1>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>Please use this OTP to verify your account.</p>
        </body>
        </html>
    `;
}