import { Request, Response } from "express";
import ConversationService from "../services/conversationService";
import statusCode from "../utils/statuscode";

const conversationService = new ConversationService();

const create = async (req: Request, res: Response) => {
    try {
        await conversationService.create(req.user.id, req.body.contactId);
        return res.status(statusCode.SUCCESS).json({
            message: "User added to contacts",
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to add to contact",
            error: error
        })
    }
}

const getWithMessage = async (req: Request, res: Response) => {
    try {
        const conversationId = String(req.params.conversationId);
        const response = await conversationService.getWithMessage(conversationId);
        return res.status(statusCode.SUCCESS).json({response});
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to get conversation",
            error: error
        })
    }
}

const deleteConversation = async (req: Request, res: Response) => {
    try {
        await conversationService.remove(req.body.conversationId);
        return res.status(statusCode.SUCCESS).json({
            message: "Conversation deleted successfully"
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to delete conversation",
            error: error
        })
    }
}

export default {
    create,
    getWithMessage,
    deleteConversation
}