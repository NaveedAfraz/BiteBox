const db = require("../../db");

const approveOrRejectOrder = async (req, res) => {
  const { orderId, status } = req.params;
  console.log(orderId, status);

  if (!orderId || !status) {
    return res
      .status(400)
      .json({ message: "Order ID and status are required." });
  }

  try {
    const query =
      "UPDATE orders SET status = ? WHERE orderID = ? AND paymentStatus != 'unpaid'";
    const values = [status, orderId];

    // Use await with pool.query
    const [results] = await db.query(query, values);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res
      .status(200)
      .json({ message: "Order status updated successfully." });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json({ message: "Error updating order status.", error });
  }
};

const fetchUserOrders = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    const query = "SELECT * FROM orders WHERE userID = ?";

    // Use await with pool.query
    const [results] = await db.query(query, [userId]);

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Error fetching orders.", error });
  }
};

module.exports = { approveOrRejectOrder, fetchUserOrders };