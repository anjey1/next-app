import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import groupRoutes from './routes/groupRoutes';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Make io available in routes
app.set('io', io);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (groupId: string) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined room ${groupId}`);
  });

  socket.on('leave_room', (groupId: string) => {
    socket.leave(groupId);
    console.log(`User ${socket.id} left room ${groupId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;