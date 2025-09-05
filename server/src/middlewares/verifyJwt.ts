import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/serverConfig";
import statusCode from "../utils/statuscode";

const { ACCESS_TOKEN_SECRET } = config;

export const verifyJwt = (req: Request, res: Response, next: NextFunction): void | Response => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
        return res.status(statusCode.UNAUTHORIZED).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        ACCESS_TOKEN_SECRET!,
        (err, decoded) => {
            if(err) {
                return res.sendStatus(statusCode.FORBIDDEN);
            }
            if(decoded)
                req.user = decoded;
            next();
        }
    )
};