const express = require("express");
const {
  addrestaurant,
  sortingANDsearching,
  fetchByCategory,
} = require("../../controller/restaurants/restaurant");
const router = express.Router();

router.post("/restaurantAddresses", addrestaurant);
router.get("/sort", sortingANDsearching);
router.get("/fetchByCategory", fetchByCategory);
// router.post("/customeraddresses");

module.exports = router;
