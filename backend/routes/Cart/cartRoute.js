const express = require("express");
const { addItem, getCart, DeleteItem } = require("../../controller/Cart/cartController");
const router = express.Router();

router.post("/addItem", addItem);
router.delete("/deleteItem", DeleteItem);
router.get("/getCart/:userId", getCart);

module.exports = router;
