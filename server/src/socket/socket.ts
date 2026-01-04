import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://100b-lilac.vercel.app'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
        credentials: true
    }
});

interface socketMap {
    [key: number]: any
}

const userSocketMap: socketMap = {};

const getReceiverSocketId = (id: number) => {
    return userSocketMap[id];
}

io.on('connection', (socket) => {
    console.log('user joined', socket.id);
    const userId: string = socket.handshake.query.userId as string;
    if(userId != "undefined") {
        userSocketMap[parseInt(userId)] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        delete userSocketMap[parseInt(userId)];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })

    socket.on('clearMessage', ({conversationId}) => {
        const receiverSocketId = getReceiverSocketId(conversationId);
        if(receiverSocketId) 
            io.to(receiverSocketId).emit('clearMessage', {conversationId});
    })

    socket.on('seen', ({conversationId, userId}) => {
        const receiverSocketId = getReceiverSocketId(conversationId);
        if(receiverSocketId)
            io.to(receiverSocketId).emit('messageSeen', {userId: userId, conversationId: conversationId})
    })

    socket.on('updateSeen', ({conversationId}) => {
        const receiverSocketId = getReceiverSocketId(conversationId);
        if(receiverSocketId)
            io.to(receiverSocketId).emit('updated', {conversationId});
    })
})

export { io, server, app};
export default getReceiverSocketId;