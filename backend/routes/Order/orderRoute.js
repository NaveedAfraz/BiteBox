const express = require("express");
const router = express.Router();
const {
  approveOrRejectOrder,
  fetchUserOrders,
} = require("../../controller/Orders/ordersController");

// POST route to approve or reject an order
router.put("/:orderId/status/:status", approveOrRejectOrder);
router.get("/fetchUserOrders/:userId", fetchUserOrders);

module.exports = router;
