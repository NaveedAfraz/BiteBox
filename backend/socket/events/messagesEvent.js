const { saveMessages } = require("../handlers/messageSend");

const messagesEvent = (socket, io) => {
  socket.on("sendMessage", async (message) => {
    const messageStored = await saveMessages(message);
    console.log(messageStored);
    if (messageStored.success) {
      socket.emit("success", messageStored);
      socket.to(`user_${messageStored.conversationId}`).emit("newMessage");
    } else {
      socket.emit("error", messageStored);
    }
  });
};

module.exports = { messagesEvent };
