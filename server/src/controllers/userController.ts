import { Request, Response } from "express";
import UserService from "../services/userService";
import statusCode from "../utils/statuscode";

const userService = new UserService();

const update = async(req: Request, res: Response) => {
    try {
        if(req.body.email) {
            return res.status(statusCode.BAD_REQUEST).json({
                success: true,
                message: "Email cannot be updated"
            })
        }
        const response = await userService.update(req.body, req.user.id);
        const { id, name, email, branch, year, role } = response;
        return res.status(statusCode.SUCCESS).json({
            success: true,
            message: "User details updated",
            user: { id, name, email, branch, year, role }
        });
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            success: true,
            message: "Failed to update user details",
            error: error
        })
    }
}

const get = async (req: Request, res: Response) => {
    try {
        const email = (req.query.email as string);
        const response = await userService.getByEmail(email);
        if(!response) {
            return res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: "User not found"
            })
        }
        const { id, name, branch, year, role } = response;
        return res.status(statusCode.SUCCESS).json({
            success: true,
            message: "User fetched",
            user: { id, name, branch, year, role }
        });
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            success: true,
            message: "Failed to get user",
            error: error
        })
    }
}

const getAll = async (req: Request, res: Response) => {
    try {
        const response = await userService.getAll(req.user.id);
        return res.status(statusCode.SUCCESS).json({
            success: true,
            message: "Fetched all users",
            response
        });
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            success: true,
            message: "Failed to get users",
            error: error
        })
    }
}

const getConversations = async (req: Request, res: Response) => {
    try {
        const conversations = await userService.getConversations(req.user.id);
        return res.status(statusCode.SUCCESS).json({
            success: true,
            message: "Fetched conversations",
            conversations
        });
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            success: false,
            message: "Failed to get conversations",
            error: error
        })
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        await userService.remove(req.body.id);
        return res.status(statusCode.SUCCESS).json({
            success: true,
            message: "User deleted"
        });
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: "Failed to delete user",
            error: error
        })
    }
}

export default {
    update,
    getAll,
    remove,
    get,
    getConversations
}