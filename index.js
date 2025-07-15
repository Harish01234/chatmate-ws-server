import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://chatmate-frontend.vercel.app'], // Include your Vercel URL
  methods: ['GET', 'POST'],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://chatmate-frontend.vercel.app'], // Include your Vercel URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send('Chat server is running');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket);
  
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room ${roomName}`);
  });

  socket.on('messageToRoom', ({ roomName, message }) => {
    io.to(roomName).emit('message', { userId: socket.id, message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
