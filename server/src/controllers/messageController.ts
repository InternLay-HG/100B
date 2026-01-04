import { Request, Response } from "express";
import MessageService from "../services/messageService";
import statusCode from "../utils/statuscode";

const messageService = new MessageService();

const send = async (req: Request, res: Response) => {
    try {
        const response = await messageService.sendMessage({...req.body, senderId: req.user.id});
        return res.status(statusCode.SUCCESS).json({response});
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to create message",
            error: error
        })
    }
}

const getMessages = async (req: Request, res: Response) => {
    try {
        const response = await messageService.getMessage(req.user.id, req.body.receiverId);
        return res.status(statusCode.SUCCESS).json({response});
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to fetch message",
            error: error
        })
    }
}

const remove = async(req: Request, res: Response) => {
    try {
        await messageService.remove(req.body.messageId);
        return res.status(statusCode.SUCCESS).json({
            message: "message deleted"
        });
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to fetch message",
            error: error
        })
    }
}

export default {
    send,
    getMessages,
    remove
}