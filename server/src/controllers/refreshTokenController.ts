import jwt from "jsonwebtoken"
import config from "../config/serverConfig";
import statusCode from "../utils/statuscode";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = config;


const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) {
        return res.status(statusCode.UNAUTHORIZED).json({
            message: 'Unauthorized access'
        });
    }
    const refreshToken = cookies.jwt;
    const user = await prisma.user.findFirst({
        where: {
            refreshToken
        }
    });
    if(!user) {
        return res.status(statusCode.NOT_FOUND).json({
            message: 'User not found'
        });
    }
    jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET!,
        (err: any, decoded: any) => {
            if(err || user.id != decoded.id) {
                return res.status(statusCode.FORBIDDEN).json({
                    message: "Failed to create token",
                    error: err
                });
            }
            const accessToken = jwt.sign({id: user.id, email: user.email, role: user.role}, ACCESS_TOKEN_SECRET!, {expiresIn: "15m"})
            return res.status(statusCode.SUCCESS).json({
                accessToken: accessToken
            });
        }
    )
}

export default handleRefreshToken;