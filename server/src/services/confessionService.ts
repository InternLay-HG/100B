import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ConfessionService {
    async create(title: string, content: string, userId: number) {
        try {
            const response = await prisma.confession.create({
                data: {
                    title,
                    content,
                    userId
                }
            })
            return response;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async remove(confessionId: string) {
        try {
            await prisma.confession.delete({
                where: {
                    id: parseInt(confessionId)
                }
            })
            return true;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async get() {
        try {
            const response = await prisma.confession.findMany();
            return response;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }
}

export default ConfessionService;