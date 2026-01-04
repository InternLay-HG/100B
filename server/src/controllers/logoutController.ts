import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import statusCode from "../utils/statuscode";

const prisma = new PrismaClient();

// on client, also delete accesssToken
const handleLogout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) {
        return res.sendStatus(statusCode.SUCCESS_NO_CONTENT);
    }
    const refreshToken = cookies.jwt;
    const user = await prisma.user.findFirst({
        where: {
            refreshToken
        }
    });
    if(!user) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        return res.sendStatus(statusCode.SUCCESS_NO_CONTENT);
    }
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken: null
        }
    })
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    return res.sendStatus(statusCode.SUCCESS_NO_CONTENT);
}

export default handleLogout;