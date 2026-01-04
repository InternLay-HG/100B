import { PrismaClient } from "@prisma/client";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import uploadFile from "../helper/s3Upload";
import config from "../config/serverConfig";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = config;

const prisma = new PrismaClient();

interface notesData {
    title: string
    subject: string
    year: string
    branch: string
}

interface Ifilters {
    subject?: string
    year?: string
    branch?: string
    title?: {}
}

const s3Client = new S3Client({
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
});

class NoteService {
    async upload(file: any, userId: number, { title, subject, year, branch }: notesData) {
        try {
            const result = await uploadFile(file);
            console.log(result);
            if (!result)
                throw new Error('Failed to upload file');
            const note = await prisma.note.create({
                data: {
                    title,
                    subject,
                    s3Url: result,
                    branch,
                    year,
                    userId
                }
            })
            console.log(note);
            return note;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async remove(filename: string, noteId: string) {
        try {
            await prisma.note.delete({
                where: {
                    id: parseInt(noteId)
                }
            });
            const params = {
                Bucket: AWS_BUCKET_NAME,
                Key: filename
            }
            const command = new DeleteObjectCommand(params);
            await s3Client.send(command);
            return true;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async getAll(ascending: string) {
        try {
            if (!ascending) ascending = 'true';
            const notes = await prisma.note.findMany({
                orderBy: {
                    createdAt: ascending == 'true' ? 'asc' : 'desc'
                }
            })
            return notes;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async getNotesWithFilter(pageNo: string, ascending: string, searchTitle?: string, subject?: string, year?: string, branch?: string, limit?: string) {
        try {
            if (!ascending) ascending = 'false';
            if (!pageNo) pageNo = '1';
            const take = limit ? parseInt(limit) : 16;
            const filters: Ifilters = { title: { contains: searchTitle, mode: 'insensitive' } };
            if (year) filters.year = year;
            if (subject) filters.subject = subject;
            if (branch) filters.branch = branch;
            const notes = await prisma.note.findMany({
                skip: (parseInt(pageNo) - 1) * take,
                take: take,
                where: filters,
                orderBy: {
                    createdAt: ascending == 'true' ? 'asc' : 'desc'
                }
            })
            return notes;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }
}

export default NoteService;