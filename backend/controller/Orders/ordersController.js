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

    db.query(query, values, (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error updating order status.", error });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found." });
      }
      return res
        .status(200)
        .json({ message: "Order status updated successfully." });
    });
  } catch (error) {
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
    // First query to get all orders for the user
    const ordersQuery = "SELECT * FROM orders WHERE userID = ?";
    const [orders] = await db.query(ordersQuery, [userId]);

    // If no orders are found, return empty array
    if (!orders.length) {
      return res.status(200).json([]);
    }

    // For each order, fetch its details
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        // Query to get order details for this specific order
        const detailsQuery = "SELECT * FROM orderDetails WHERE orderID = ?";
        const [details] = await db.query(detailsQuery, [order.orderID]);

        // Return the order with its details
        return {
          ...order,
          details: details,
        };
      })
    );

    return res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("Error fetching orders with details:", error);
    return res
      .status(500)
      .json({
        message: "Error fetching orders with details.",
        error: error.message,
      });
  }
};

module.exports = { approveOrRejectOrder, fetchUserOrders };
