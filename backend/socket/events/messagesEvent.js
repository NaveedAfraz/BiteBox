const { saveMessages } = require("../handlers/messageSend");

const messagesEvent = (socket, io) => {
  socket.on("sendMessage", async (message) => {
     console.log(message, "msgs");

    const messageStored = await saveMessages(message);
    console.log(messageStored);
    if (messageStored) {

     //socket.emit("success", messageStored);
      io.to(`conversation_${messageStored.conversationId}`).emit("newMessage", messageStored);

     //io.to(receiverSocketId).emit("newMessage", messageStored);
    } else {
      socket.emit("error", messageStored);
    }
  });
};

module.exports = { messagesEvent };
