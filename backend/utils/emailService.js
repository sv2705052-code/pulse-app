import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Pulse App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Pulse Verification Code",
        text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
        html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px;">
        <h2 style="color: #a855f7;">Pulse App</h2>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #ec4899; letter-spacing: 5px; margin: 20px 0;">${otp}</div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `,
    };

    try {
        // Only attempt to send if credentials exist
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`\n\n[DEV] OTP for ${email} is: ${otp}\n\n`);
            return true;
        }

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        // In dev or on failure, we log the OTP so the user can still register
        console.log(`\n\n[FALLBACK] OTP for ${email} is: ${otp}\n\n`);
        return true; // Still return true as a fallback so user isn't stuck
    }
};
