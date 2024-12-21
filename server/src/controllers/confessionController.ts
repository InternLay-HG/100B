import { Request, Response } from "express";
import ConfessionService from "../services/confessionService";
import statusCode from "../utils/statuscode";

const confessionService = new ConfessionService();

const create = async (req: Request, res: Response) => {
    try {
        const response = await confessionService.create(req.body.title, req.body.content, req.user.id);
        return res.status(statusCode.SUCCESS).json({response})
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to create confession",
            error: error
        })
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        await confessionService.remove(req.body.confessionId);
        return res.status(statusCode.SUCCESS).json({
            message: "Confession deleted"
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to delete confession",
            error: error
        })
    }
}

const getAll = async (req: Request, res: Response) => {
    try {
        const response = await confessionService.get();
        return res.status(statusCode.SUCCESS).json({response});
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to get confession",
            error: error
        })
    }
}

export default {
    create,
    remove,
    getAll
}