import AuthService from "../services/authService";
import { Request, Response} from "express";
import statusCode from "../utils/statuscode";

const authService = new AuthService();

const signup = async (req: Request, res: Response) => {
    try {
        const response = await authService.signup(req.body);
        if(response == 400) {
            return res.status(statusCode.BAD_REQUEST).json({
                success: true,
                message: "Please use IIIT Ranchi email"
            })
        }
        const { id, name, email, branch, year } = response;
        return res.status(statusCode.SUCCESS).json({ success: true, user: { id, name, email, branch, year }});
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            success: false,
            message: "Failed to signup",
            error: error
        });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const response = await authService.login(req.body);
        if(response == 404)
            return res.status(statusCode.NOT_FOUND).json({ success: false, message: "User not found" });
        if(response == 400)
            return res.status(statusCode.BAD_REQUEST).json({ success: false, message: "Incorrect password" });
        const { refreshToken, accessToken, user } = response;
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24*60*60*1000 });
        const { id, name, email, year, branch } = user;
        return res.status(statusCode.SUCCESS).json({ success: true, accessToken: accessToken, user: {id, email, name, year, branch}});
    } catch(error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            success: false,
            message: "Failed to login",
            error: error
        });
    }
}

export default {
    signup,
    login
}