"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendEmail = async (subject, email, html) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.QPLAY_GMAIL_ADRESS,
                pass: process.env.QPLAY_GMAIL_PASSWORD,
            },
        });
        await transporter.sendMail({
            from: "noreply@qplay.de",
            to: email,
            subject: subject,
            html: html, // plain text body
        });
    }
    catch (e) {
        return e;
    }
};
exports.sendEmail = sendEmail;
