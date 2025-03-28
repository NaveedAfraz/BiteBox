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
 
io.on("connection", (socket) => {
  // const userId = socket.handshake.query.userId; // Get user ID from client
  // onlineUsers[userId] = socket.id; // Store user socket ID

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });
  //console.log(`User ${userId} connected with socket ID ${socket.id}`);
 // console.log(onlineUsers);

  messagesEvent(socket, io);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

module.exports = { io, server, app };
