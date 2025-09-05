import { Request, Response } from "express";
import EmailService from "../services/emailService";
import statusCode from "../utils/statuscode";

const emailService = new EmailService();

const generateOtp = async (req: Request, res: Response) => {
    try {
        const response = await emailService.sendOtp(req.body.id, req.body.mailTo);
        return res.status(statusCode.SUCCESS).json({
            otp: response,
            success: true,
            message: "Otp generated"
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            success: false,
            message: "Failed to generate otp"
        })
    }
}

const generateResetPasswordToken = async (req: Request, res: Response) => {
    try {
        const response = await emailService.sendResetPasswordToken(req.body.userId, req.body.email, req.body.role);
        return res.status(statusCode.SUCCESS).json({
            token: response,
            success: true,
            message: "Token generated"
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            success: false,
            message: "Failed to generate reset token"
        })
    }
}

export default {
    generateOtp,
    generateResetPasswordToken
}