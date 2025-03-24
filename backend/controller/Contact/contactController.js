const pool = require("../../db");

const fetchMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    console.log(userId);

    const conversationsQuery = "SELECT * FROM conversations WHERE userID = ?"; 
    const [conversations] = await pool.execute(conversationsQuery, [userId]);
    console.log(conversations, "conversationsF");
 
    if (conversations && conversations.length > 0) {
      const conversationIds = conversations.map((conv) => conv.id);
      console.log(conversationIds, "conversationIds");
      const participantsQuery =
        "SELECT * FROM participants WHERE conversation_id IN (?)";
      const [participants] = await pool.execute(participantsQuery, [
        conversationIds.join(","),
      ]);

      console.log(participants, "participants");

      const messagesQuery =
        "SELECT * FROM messages WHERE conversation_id IN (?) ORDER BY  created_at ASC";
      const [messages] = await pool.execute(messagesQuery, [
        conversationIds.join(","),
      ]);
      console.log(messages, "messages");

      const result = conversations.map((conversation) => {
        const conversationParticipants = participants.filter(
          (p) => p.conversation_id === conversation.id
        );
        console.log(conversationParticipants, "conversationParticipants");

        const conversationMessages = messages.filter(
          (m) => m.conversation_id === conversation.id
        );
        console.log(conversationMessages, "conversationMessages");

        return {
          ...conversation,
          participants: conversationParticipants,
          messages: conversationMessages,
        };
      });

      return res.status(200).json(result);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { fetchMessages };
