const express = require("express");
const {
  addrestaurant,
  sortingANDsearching,
  fetchByCategory,
  fetchRestaurants,
} = require("../../controller/restaurants/restaurant");
const router = express.Router();

router.post("/AddrestaurantAndAddresses", addrestaurant);
router.get("/sort", sortingANDsearching);
router.get("/fetchRestaurant/:id", fetchRestaurants);
router.get("/fetchByCategory", fetchByCategory);
// router.post("/customeraddresses");

module.exports = router;
