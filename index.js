import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

// ✅ Allowed frontend origins (no trailing slash)
const allowedOrigins = [
  'http://localhost:5173',
  'https://chatmate-fe.vercel.app'
];

// ✅ Enable CORS for REST endpoints
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Set up Socket.IO with correct CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Base route
app.get('/', (req, res) => {
  res.send('Chat server is running 🚀');
});

// ✅ Socket.IO logic
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`📥 ${socket.id} joined room: ${roomName}`);
  });

  socket.on('messageToRoom', ({ roomName, message }) => {
    io.to(roomName).emit('message', { userId: socket.id, message });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
