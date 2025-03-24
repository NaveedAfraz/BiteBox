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
  console.log("A user connected:", socket.id);

  messagesEvent(socket, io);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
 
module.exports = { io, server, app };
