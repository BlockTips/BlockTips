const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000, // Increase to handle serverless idle
  pingInterval: 25000
});
const port = process.env.PORT || 3000;

app.use(express.static('public'));

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