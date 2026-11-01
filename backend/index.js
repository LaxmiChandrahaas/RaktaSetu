const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
require('dotenv').config();

const donorRoutes = require('./routes/donorRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();
const http = require('http').createServer(app);

const io = socketIo(http, { cors: { origin: '*' } });
app.set('socketio', io);

app.use(cors());
app.use(express.json());

// ----- MongoDB Connection -----
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Forces an error if it can't connect in 5 seconds
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ Client disconnected:', socket.id));
});

app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }[dbState] || 'unknown';
  res.json({ status: 'ok', database: dbStatus });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log('🚀 RaktaSetu backend running on http://localhost:' + PORT);
});