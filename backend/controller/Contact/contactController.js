const pool = require("../../db");

const fetchMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    // console.log("User ID:", userId);

    // 1. Get all participant rows for the user
    const participantsQuery = "SELECT * FROM participants WHERE user_id = ?";
    const [participants] = await pool.execute(participantsQuery, [userId]);
    // console.log("Participants:", participants);

    // If no participant records are found, return an empty array.
    if (!participants || participants.length === 0) {
      return res.status(200).json([]);
    }

    // 2. Extract all conversation IDs from the participants result
    const conversationIds = participants.map((p) => p.conversation_id);
    // console.log("Conversation IDs:", conversationIds);

    // 3. Fetch conversation details for these conversation IDs
    const conversationQuery = "SELECT * FROM conversations WHERE id IN (?)";
    const [conversations] = await pool.execute(
      conversationQuery,
      conversationIds
    );
    // console.log("Conversations:", conversations);
    // console.log(conversationQuery);

    // 4. Fetch all messages belonging to these conversation IDs
    const messagesQuery =
      "SELECT * FROM messages WHERE conversation_id IN (?) ORDER BY created_at ASC";
    const [messages] = await pool.execute(messagesQuery, conversationIds);
    // console.log("Messages:", messages);

    // 5. Combine the conversation details with their participants and messages
    const result = conversations.map((conv) => {
      // Get participants for this conversation
      const convParticipants = participants.filter(
        (p) => p.conversation_id === conv.id
      );
      // Get messages for this conversation
      const convMessages = messages.filter(
        (m) => m.conversation_id === conv.id
      );

      return {
        ...conv,
        participants: convParticipants,
        messages: convMessages,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    // console.error("Error fetching messages:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { fetchMessages };
