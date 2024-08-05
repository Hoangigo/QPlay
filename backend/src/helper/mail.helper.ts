import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (subject: string, email: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.QPLAY_GMAIL_ADRESS,
                pass: process.env.QPLAY_GMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: "noreply@qplay.de", // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: html, // plain text body
          });

    } catch (e) {
        return e;
    }
}