import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class UserService {
    async update(data: any, userId: number) {
        try {
            if(data.password) {
                const salt = bcrypt.genSaltSync(10);
                data.password = await bcrypt.hashSync(data.password, salt);
            }
            const response = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {...data}
            })
            return response;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async getConversations(userId: number) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: userId
                },
                include: {
                    conversations: {
                        include: {
                            messages: true,
                            participants: true
                        }
                    }
                }
            })
            return user?.conversations;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async getByEmail(email: string) {
        try {
            const response = await prisma.user.findFirst({
                where: {
                    email
                }
            })
            return response;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async getAll(userId: number) {
        try {
            const response = await prisma.user.findMany({
                where: {
                    id: {
                        not: userId
                    }
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    year: true
                }
            })
            return response;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async remove(id: string) {
        try {
            await prisma.user.delete({
                where: {
                    id: parseInt(id)
                }
            })
            return true;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }
}

export default UserService;