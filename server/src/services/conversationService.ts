import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ConversationService {
    async create(userId: number, contactId: string) {
        try {
            await prisma.conversation.create({
                data: {
                    participants: {
                        connect: [
                            { id: userId },
                            { id: parseInt(contactId) }
                        ]
                    }
                }
            })
            return true;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async getWithMessage(conversationId: string) {
        try {
            const response = await prisma.conversation.findFirst({
                where: {
                    id: parseInt(conversationId)
                },
                select: {
                    messages: true
                }
            })
            return response;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async remove(conversationId: string) {
        try {
            await prisma.$transaction([
                prisma.message.deleteMany({
                    where: {
                        conversationId: parseInt(conversationId)
                    }
                }),
                prisma.conversation.delete({
                    where: {
                        id: parseInt(conversationId)
                    }
                })
            ]);
            return true;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }
}

export default ConversationService;