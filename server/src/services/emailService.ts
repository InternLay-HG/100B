import sender from "../config/emailConfig";
import config from "../config/serverConfig";
import { PrismaClient, Role } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const { EMAIL, ACCESS_TOKEN_SECRET } = config;

class EmailService {
    async sendOtp(id: string, mailTo: string) {
        try {
            let randomNumber: string | number = Math.floor(Math.random() * 1000000);
            randomNumber = randomNumber.toString().padStart(6, "0");

            prisma.user.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    otp: randomNumber
                }
            })

            sender.sendMail({
                from: EMAIL,
                to: mailTo,
                subject: 'Agora otp',
                text: randomNumber
            })
            return randomNumber;
        } catch (error) {
            throw error;
        }
    }

    async sendResetPasswordToken(userId: string, email: string, role: Role) {
        try {
            const resetToken = jwt.sign({ id: userId, email, role }, ACCESS_TOKEN_SECRET!, { expiresIn: "1hr" });
            prisma.user.update({
                where: {
                    id: parseInt(userId)
                },
                data: {
                    resetToken
                }
            })
            sender.sendMail({
                from: EMAIL,
                to: email,
                subject: "Agora Password Reset",
                text: `Click on this link to reset password "http://localhost:5173/reset-password/${resetToken}"`
            })
            return resetToken;
        } catch (error) {
            throw error;
        }
    }
}

export default EmailService;