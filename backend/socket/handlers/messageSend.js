const pool = require("../../db");

const saveMessages = async ({ formData }) => {
  //console.log(formData, "dart");
  const { content, conversationID, senderId, senderType } = formData;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    if (conversationID) {
      const q = "SELECT * FROM conversations WHERE id = ?";
      const [rows] = await connection.execute(q, [conversationID]);

      if (rows.length === 0) {
        throw new Error("Conversation not found");
      }

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
        conversationId: conversationID,
        message: content,
        senderId: senderId,
        senderType: senderType,
        createdAt: new Date(),
        readStatus: 0,
      };
    } else {
      let title = formData.title;
      let content = formData.message;
      let senderId = formData.senderId;
      let senderType = formData.senderType;
      let orderId = formData.orderId;
      let userType = formData.senderType;
      //console.log(title, content, senderId, senderType, orderId, userType);

      // First, fetch the restaurant ID associated with the order
      const [orderDetails] = await connection.execute(
        "SELECT restaurantID FROM orders WHERE orderID = ?",
        [orderId]
      );
      //console.log(orderDetails, "orderDetails");
      if (orderDetails.length === 0) {
        throw new Error("Order not found");
      }

      const restaurantId = orderDetails[0].restaurantID;

      // Fetch restaurant details for the title
      const [restaurantDetails] = await connection.execute(
        "SELECT userID FROM Restaurant WHERE restaurantID = ?",
        [restaurantId]
      );
     //ccconsole.log(restaurantDetails);

      // Update title with restaurant name if available
      // title = title || `Conversation with ${restaurantDetails[0]?.Name || 'Restaurant'}`;

      const insertConversation =
        "INSERT INTO conversations (title, created_at,status,userID) VALUES (?,?,?,?)";
      const [conversationResult] = await connection.execute(
        insertConversation,
        [title, new Date(), "new", senderId]
      );

      const conversationId = conversationResult.insertId;

      // Add sender as participant
      const insertSenderParticipant =
        "INSERT INTO participants (conversation_id, user_id, user_type, order_id) VALUES (?,?,?,?)";
      await connection.execute(insertSenderParticipant, [
        conversationId,
        senderId,
        userType,
        orderId,
      ]);

      // Add restaurant as participant
      const insertRestaurantParticipant =
        "INSERT INTO participants (conversation_id, user_id, user_type, order_id) VALUES (?,?,?,?)";
      await connection.execute(insertRestaurantParticipant, [
        conversationId,
        restaurantDetails[0].userID,
        "vendor",
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
    //console.error("Error in saveMessages:", error);
    return {
      success: false,
      error: error.message || "Failed to save message",
    };
  } finally {
    connection.release();
  }
};

module.exports = { saveMessages };
