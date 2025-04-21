import { io } from "socket.io-client";

let socket; // Store socket instance to maintain a single connection

export const initializeSocket = (userId) => {
  //  console.log(userId);

  if (!userId) {
    console.error("User ID is missing, socket connection not established.");
    return;
  }

  if (!socket) {
    socket = io(`${import.meta.env.VITE_API_URL}`, {
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
