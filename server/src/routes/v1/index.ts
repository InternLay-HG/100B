import express, { NextFunction, Request, Response } from "express";
import multer, { MulterError, FileFilterCallback } from "multer";
import authController from "../../controllers/authController";
import handleRefreshToken from "../../controllers/refreshTokenController";
import handleLogout from "../../controllers/logoutController";
import noteController from "../../controllers/noteController";
import pollController from "../../controllers/pollController";
import voteController from "../../controllers/voteController";
import userController from "../../controllers/userController";
import announcementController from "../../controllers/announcementController";
import messageController from "../../controllers/messageController";
import conversationController from "../../controllers/conversationController";
import confessionController from "../../controllers/confessionController";
import emailController from "../../controllers/emailController";
import statusCode from "../../utils/statuscode";
import { verifyJwt } from "../../middlewares/verifyJwt";

const router: any = express.Router();
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if(file.mimetype.split('/')[0] == "application" || file.mimetype.split('/')[0] == "image") {
        cb(null, true);
    } else {
        //@ts-ignore
        cb(new MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
}

const uploadHandle = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50000000, files: 1}
})

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/refresh', handleRefreshToken);
router.post('/logout', handleLogout);
router.post('/verify/otp', emailController.generateOtp);
router.post('/reset/password', emailController.generateResetPasswordToken);

router.post('/upload/note', verifyJwt, uploadHandle.single('file'), noteController.upload);
router.get('/notes', verifyJwt, noteController.getAll);
router.get('/filter/notes', verifyJwt, noteController.getNotesByFilter);
router.delete('/delete/note', verifyJwt, noteController.remove);

router.post('/poll', verifyJwt, pollController.create);
router.get('/poll', verifyJwt, pollController.getPoll);
router.delete('/poll', verifyJwt, pollController.remove);
router.get('/polls', verifyJwt, pollController.getPolls);
router.get('/filter/polls', verifyJwt, pollController.getPollWithFilters);
router.patch('/close/poll', verifyJwt, pollController.closePoll);
router.patch('/extend/poll', verifyJwt, pollController.extendPoll);

router.post('/vote', verifyJwt, voteController.vote);

router.patch('/user', verifyJwt, userController.update);
router.get('/users', verifyJwt, userController.getAll);
router.get('/user', userController.get);
router.get('/user/conversations', verifyJwt, userController.getConversations);
router.delete('/user', userController.remove);

router.post('/announcement', verifyJwt, uploadHandle.single('file'), announcementController.create);
router.patch('/announcement', verifyJwt, announcementController.update);
router.delete('/announcement', verifyJwt, announcementController.remove);

router.post('/message', verifyJwt, messageController.send);
router.get('/messages', verifyJwt, messageController.getMessages);
router.delete('/message', verifyJwt, messageController.remove);

router.post('/conversation', verifyJwt, conversationController.create);
router.get('/conversation/:conversationId', verifyJwt, conversationController.getWithMessage);
router.delete('/conversation', verifyJwt, conversationController.deleteConversation);

router.post('/confession', verifyJwt, confessionController.create);
router.delete('/confession', verifyJwt, confessionController.remove);
router.get('/confessions', verifyJwt, confessionController.getAll);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof MulterError) {
        if(err.code == "LIMIT_UNEXPECTED_FILE") {
            return res.status(statusCode.BAD_REQUEST).json({
                error: "File type not supported"
            })
        } else if(err.code == "LIMIT_FILE_SIZE") {
            return res.status(statusCode.BAD_REQUEST).json({
                error: "File size too large"
            })
        } else if(err.code == "LIMIT_FILE_COUNT") {
            return res.status(statusCode.BAD_REQUEST).json({
                error: "Too many files"
            })
        }
    }
    next();
})

export default router;