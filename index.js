const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connected for alerts');
  socket.on('donation', (data) => {
    console.log('Received donation:', data); // Debug log
    io.emit('donationAlert', data);
  });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});