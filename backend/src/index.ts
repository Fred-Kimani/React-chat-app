import dotenv from 'dotenv';
dotenv.config({ path: './backend/src/.env' });

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "./Models/User.ts";
const JWT_SECRET = process.env.JWT_SECRET!;
import Message from './Models/Message.ts';
import ChatRoom from './Models/ChatRoom.ts';


import mongoose from "mongoose";


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

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("🚨 MONGO_URI is not defined in your .env file");
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));




io.on('connection', (socket) => {
  const groups = new Map<string, { name: string; createdBy: string }>();
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
  socket.on('send-message', async(message: Message) => {
    try {
      const savedMessage = await Message.create({
        sender: message.sender,
        content: message.content,
        roomId: message.roomId
      });
      io.to(message.roomId).emit('receive-message', {
        ...message,
        _id:savedMessage._id,
        createdAt:savedMessage.createdAt
      });
      
    } catch (error) {
      console.error('❌ Error saving message:', error);
    }
    console.log('Message to', message.roomId, ':', message.content);
  });

  socket.on('create-group', ({ groupName, username }) => {
    const groupId = `group_${Date.now()}`;
    groups.set(groupId, { name: groupName, createdBy: username });

    // Optionally auto-join the creator to the group
    socket.join(groupId);
    socket.emit('group-created', { groupId, groupName });
    io.emit('new-group', { groupId, groupName, createdBy: username }); // notify all users
  });

  // You can also emit the current list of groups if needed
  socket.on('get-groups', () => {
    const groupList = Array.from(groups.entries()).map(([id, info]) => ({
      groupId: id,
      groupName: info.name,
      createdBy: info.createdBy,
    }));
    socket.emit('group-list', groupList);
  });

  socket.on('disconnect', () => {
    console.log(`❌ ${socket.id} disconnected`);
  });
});

//Register user
app.post("/register", async (req: express.Request, res: express.Response) => {
  const { email, firstName, lastName, password, confirmPassword } = req.body;

  try {
    // Check if all fields are provided
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      console.log('Error: Missing required fields');
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log('Error: Passwords do not match');
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Error: User with email ${email} already exists`);
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

    // Send success response with user info and token
    console.log('User registered successfully:', newUser);
    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });

  } catch (error) {
    // Log error and send internal server error response
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

});

app.post('/login', async(req:express.Request, res:express.Response)=>{
  const {email, password} = req.body
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
})

// POST /chatrooms/create-group
app.post('/chatrooms/create-group', async (req:express.Request, res: express.Response) => {
  const { name } = req.body;

  const existingRoom = await ChatRoom.findOne({ name, isPrivate: false });
  if (existingRoom) return res.status(400).json({ message: 'Group already exists' });

  const newRoom = new ChatRoom({ name, isPrivate: false });
  await newRoom.save();

  res.status(201).json(newRoom);
});

app.get('/chatrooms', async (req, res) => {
  const rooms = await ChatRoom.find({ isPrivate: false });
  res.json(rooms);
});

// GET /messages/:roomId
app.get('/messages/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ roomId })
      .populate('sender', 'email') // Optional: include sender info
      .sort({ createdAt: 1 });     // Optional: sort oldest → newest

    res.json(messages);
  } catch (err) {
    console.error('❌ Failed to fetch messages', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


app.post('/messages', async (req, res) => {
  const { sender, roomId, content } = req.body;

  try {
    const message = new Message({ sender, roomId, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Message not saved' });
  }
});

/*app.get('/direct-message', async (req, res)=>{
  const dm = await ChatRoom.find({isPrivate: true, })

}) */




httpServer.listen(3001, () => {
  console.log('Server listening on port 3001');
});