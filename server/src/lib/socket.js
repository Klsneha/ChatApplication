import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

export const userSocketMap = {};

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Your React URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log('User connected:', socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  

  // Join a specific room (usually the conversation ID)
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  // Listen for a message from a client
  socket.on('send_message', (data) => {
    // data = { roomId, senderId, text, image, ... }
    // Broadcast to everyone in the room (including the sender)
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
    
  });
});

export { io, server, app };