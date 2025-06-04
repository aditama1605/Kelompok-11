const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log("No token provided");
    return next(new Error("Authentication error: No token provided"));
  }
  next();
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("joinRoom", (roomName) => {
    console.log(`User ${socket.id} joined room: ${roomName}`);
    socket.join(roomName);
  });

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    io.to(data.room).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("Connect error:", err.message);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});