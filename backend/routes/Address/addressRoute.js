const express = require("express");
const {} = require("../../controller/restaurants/restaurant");
const {
  fetchAddress,
  addAddress,
  deleteAddress,
} = require("../../controller/Address/addressController");
const router = express.Router();

router.get("/fetchAddresses/:userID", fetchAddress);
router.post("/addAddress", addAddress);
router.delete("/deleteAddress/:addressID/:userID", deleteAddress);

module.exports = router;
