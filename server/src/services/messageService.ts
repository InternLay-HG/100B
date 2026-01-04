import { PrismaClient } from "@prisma/client";
import getReceiverSocketId from "../socket/socket";
import { io } from "../socket/socket";

const prisma = new PrismaClient();

interface messageData {
    senderId: string
    receiverId: string
    content: string
    conversationId?: string
}

class MessageService {
    async sendMessage(data: messageData) {
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
            const message = await prisma.message.create({
                data: {
                    senderId: parseInt(data.senderId),
                    receiverId: parseInt(data.receiverId),
                    content: data.content,
                    conversationId: parseInt(conversationId)
                }
            })
            const receiverSocketId = getReceiverSocketId(parseInt(receiverId));
            if(receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', message);
            }
            return message;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async getMessage(senderId: number, receiverId: string) {
        try {
            const conversation = await prisma.conversation.findFirst({
                where: {
                    participants: {
                        some: {
                            id: { in: [senderId, parseInt(receiverId)]}
                        }
                    }
                },
                include: {
                    messages: true
                }
            })
            if(!conversation)
                return [];
            return conversation.messages;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }

    async remove(messageId: string) {
        try {
            await prisma.message.delete({
                where: {
                    id: parseInt(messageId)
                }
            })
            return true;
        } catch (error) {
            console.log('Something went wrong in the service layer');
            throw error;
        }
    }
}

export default MessageService;