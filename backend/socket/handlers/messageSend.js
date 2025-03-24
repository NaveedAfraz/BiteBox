const pool = require("../../db");
const saveMessages = async (data) => {
  const {
    title,
    userId,
    userType,
    orderId,
    senderId,
    senderType,
    content,
    conversationID,
  } = data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check if conversation already exists
    if (conversationID) {
      const q = "SELECT * FROM conversations WHERE id = ?";
      const [rows] = await connection.execute(q, [conversationID]);

      if (rows.length === 0) {
        throw new Error("Conversation not found");
      }

      // Add new message to existing conversation
      const insertMessage =
        "INSERT INTO messages (conversation_id, sender_id, sender_type, content, created_at, read_status) VALUES (?,?,?,?,?,?)";
      await connection.execute(insertMessage, [
        conversationID,
        senderId,
        senderType,
        content,
        new Date(),
        0,
      ]);

      await connection.commit();

      return {
        success: true,
        message: "Message added to conversation",
        conversationId: conversationID,
      };
    } else {
      const insertConversation =
        "INSERT INTO conversations (title, created_at) VALUES (?,?)";
      const [conversationResult] = await connection.execute(
        insertConversation,
        [title, new Date()]
      );

      const conversationId = conversationResult.insertId;

      // Add participant
      const insertParticipant =
        "INSERT INTO participants (conversation_id, user_id, user_type, order_id) VALUES (?,?,?,?)";
      await connection.execute(insertParticipant, [
        conversationId,
        userId,
        userType,
        orderId,
      ]);

      const insertMessage =
        "INSERT INTO messages (conversation_id, sender_id, sender_type, content, created_at, read_status) VALUES (?,?,?,?,?,?)";
      const [messageResult] = await connection.execute(insertMessage, [
        conversationId,
        senderId,
        senderType,
        content,
        new Date(),
        0,
      ]);

      const [conversationData] = await connection.execute(
        "SELECT * FROM conversations WHERE id = ?",
        [conversationId]
      );

      await connection.commit();

      return {
        success: true,
        message: "New conversation created",
        conversation: conversationData[0],
        conversationId: conversationId,
        messageId: messageResult.insertId,
      };
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error in saveMessages:", error);
    return {
      success: false,
      error: error.message || "Failed to save message",
    };
  } finally {
    connection.release();
  }
};

module.exports = { saveMessages };
