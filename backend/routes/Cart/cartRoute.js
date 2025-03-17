const express = require("express");
const { addItem, getCart } = require("../../controller/Cart/cartController");
const { deleteItem } = require("../../controller/restaurants/restaurant");
const router = express.Router();

router.get("/addItem", addItem);
router.post("/deleteItem", deleteItem);
router.get("/getCart/:userID", getCart);

module.exports = router;
