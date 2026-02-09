const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); // Add this for correct path resolution

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000, // Increase to handle serverless idle
  pingInterval: 25000
});
const port = process.env.PORT || 3000;

// Serve static files from root 'public' (adjust path from api folder)
app.use(express.static(path.join(__dirname, '..', 'public')));

console.log('Static path:', path.join(__dirname, '..', 'public'));

// NEW: Explicit root route to serve index.html
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  console.log('Trying to serve root index.html at:', indexPath); // Additional log for debug
  res.sendFile(indexPath);
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('Client connected for alerts');
  socket.on('donation', (data) => {
    console.log('Received donation:', data);
    io.emit('donationAlert', data);
  });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});