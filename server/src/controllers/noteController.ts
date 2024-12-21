import { Request, Response } from "express";
import NoteService from "../services/noteService";
import statusCode from "../utils/statuscode";

const noteService = new NoteService();

const upload = async (req: Request, res: Response) => {
    try {
        const response = await noteService.upload(req.file, req.user.id, req.body);
        return res.status(statusCode.SUCCESS).json({
            response
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: 'Failed to upload file',
            error: error
        })
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        await noteService.remove(req.body.filename, req.body.noteId);
        return res.status(statusCode.SUCCESS).json({
            message: 'File deleted'
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: 'Failed to delete file',
            error: error
        })
    }
}

const getAll = async (req: Request, res: Response) => {
    try {
        const notes = await noteService.getAll(req.body.ascending);
        return res.status(statusCode.SUCCESS).json({
            notes
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: 'Failed to get notes',
            error: error
        })
    }
}

const getNotesByFilter = async (req: Request, res: Response) => {
    try {
        const { pageNo, ascending, subject, year, branch, searchTitle } = req.query;
        const notes = await noteService.getNotesWithFilter(pageNo as string, ascending as string, searchTitle as string, subject as string, year as string, branch as string);
        return res.status(statusCode.SUCCESS).json({
            notes
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_ERROR).json({
            message: 'Failed to get notes',
            error: error
        })
    }
}

export default {
    upload,
    remove,
    getAll,
    getNotesByFilter
}