import dotenv from 'dotenv';
dotenv.config({ path: './backend/src/.env' });

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import mongoose from "mongoose";
import authRoutes from './routes/auth.ts'


const app = express();
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

type ChatRoom ={
  id: string;
  name: string;
  isPrivate: boolean;
  allowedUsers?: string[]

}

type Message = {
  sender: string,
  content: string,
  roomId: string
}

type PrivateChatKey = string;

const privateChats = new Map<PrivateChatKey, string>();


app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes)

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("🚨 MONGO_URI is not defined in your .env file");
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));




io.on('connection', (socket) => {
  console.log(`⚡ ${socket.id} connected`);

  // === Join a public room ===
  socket.on('join-group', ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined group ${roomId}`);
    socket.to(roomId).emit('system-message', `${username} joined the group`);
  });

  // === Private 1-to-1 room logic ===
  socket.on('start-private-chat', ({ userA, userB }) => {
    const key = [userA, userB].sort().join('_');
    let roomId = privateChats.get(key);

    if (!roomId) {
      roomId = `private_${Date.now()}_${Math.random()}`;
      privateChats.set(key, roomId);
    }

    socket.join(roomId);
    socket.emit('private-room-created', { roomId });
  });

  // === Handle chat messages ===
  socket.on('send-message', (message: Message) => {
    console.log('Message to', message.roomId, ':', message.content);
    io.to(message.roomId).emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log(`❌ ${socket.id} disconnected`);
  });
});




httpServer.listen(3001, () => {
  console.log('Server listening on port 3001');
});