const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (restrict in production, e.g., to your domain)
    methods: ['GET', 'POST'],
  },
});
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('Client connected for alerts:', socket.id);

  socket.on('donation', (data) => {
    console.log('Received donation:', data);
    io.emit('donationAlert', data);
  });

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });
});

// Error handling
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Start server
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Optional: For scale, add Redis adapter (install redis and @socket.io/redis-adapter)
// const { createAdapter } = require('@socket.io/redis-adapter');
// const { createClient } = require('redis');
// const pubClient = createClient({ url: process.env.REDIS_URL });
// const subClient = pubClient.duplicate();
// io.adapter(createAdapter(pubClient, subClient));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});