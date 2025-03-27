const { saveMessages } = require("../handlers/messageSend");

const messagesEvent = (socket, io) => {
  socket.on("sendMessage", async (message) => {
   // console.log(message, "msgs");

    const messageStored = await saveMessages(message);
     console.log(messageStored);
    if (messageStored) {
      //console.log(true, message);
      
      socket.emit("success", messageStored);
      socket.to(`user_${messageStored.conversationId}`).emit("newMessage");
    } else {
      socket.emit("error", messageStored);
    }
  });
};

module.exports = { messagesEvent };
