import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface messageData {
    senderId: string
    receiverId: string
    content: string
    conversationId?: string
}

class MessageService {
    async create(data: messageData) {
        try {
            let conversationId = data.conversationId;
            const { senderId, receiverId } = data;
            let conversation;
            if(!conversationId) {
                conversation = await prisma.conversation.findFirst({
                    where: {
                        participants: {
                            some: {
                                id: { in: [parseInt(senderId), parseInt(receiverId)]}
                            }
                        }
                    }
                })
                if(!conversation) {
                    conversation = await prisma.conversation.create({
                        data: {
                            participants: {
                                connect: [
                                    {id: parseInt(senderId)},
                                    {id: parseInt(receiverId)}
                                ]
                            }
                        }
                    })
                }
                conversationId = String(conversation.id);
            }
            const response = await prisma.message.create({
                data: {
                    senderId: parseInt(data.senderId),
                    receiverId: parseInt(data.receiverId),
                    content: data.content,
                    conversationId: parseInt(conversationId)
                }
            })
            return response;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }
}

export default MessageService;