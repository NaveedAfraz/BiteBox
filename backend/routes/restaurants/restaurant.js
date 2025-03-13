const express = require("express");
const { addrestaurant } = require("../../controller/restaurants/restaurant");
const router = express.Router();

router.post("/restaurantAddresses", addrestaurant);
// router.post("/customeraddresses");

module.exports = router;
