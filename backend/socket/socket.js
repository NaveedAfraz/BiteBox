const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const { messagesEvent } = require("./events/messagesEvent");

const server = http.createServer(app);
//const io = new Server(server);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
});
const onlineUsers = {};
io.on("connection", (socket) => {
  
  const userId = socket.handshake.query.userId; // Get user ID from client
  onlineUsers[userId] = socket.id; // Store user socket ID

  console.log(`User ${userId} connected with socket ID ${socket.id}`);

  messagesEvent(socket, io);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

module.exports = { io, server, app };
