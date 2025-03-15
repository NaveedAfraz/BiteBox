const express = require("express");
const {
  addrestaurant,
  sortingANDsearching,
  fetchByCategory,
  fetchRestaurants,
  additem,
  fetchAlrlrestaurants,
  fetchAllrestaurants,
  fetchAllUsers,
} = require("../../controller/restaurants/restaurant");
const router = express.Router();

router.post("/AddrestaurantAndAddresses", addrestaurant);
router.get("/sort", sortingANDsearching);
router.get("/fetchRestaurant/:id", fetchRestaurants);
router.get("/fetchAllRestaurants", fetchAllrestaurants);
router.get("/fetchAllUsers/:userID", fetchAllUsers);
router.get("/fetchByCategory", fetchByCategory);
router.post("/addItem", additem);
// router.post("/customeraddresses");

module.exports = router;
