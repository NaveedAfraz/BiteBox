import { io } from "socket.io-client";

let socket; // Store socket instance to maintain a single connection

export const initializeSocket = (userId) => {
  if (!userId) {
    console.error("User ID is missing, socket connection not established.");
    return null;
  }
  
  if (!socket) {
    socket = io("http://localhost:3006", {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};
