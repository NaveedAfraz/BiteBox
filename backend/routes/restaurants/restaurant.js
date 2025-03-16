const express = require("express");
const {
  addrestaurant,
  sortingANDsearching,
  fetchByCategory,
  fetchRestaurants,
  additem,
  fetchAllrestaurants,
  fetchAllUsers,
  updateUser,
  deleteRestaurant,
  updateItem,
  deleteItem,
  getReviews,
  deleteReview,
  insertreviews,
  approvalORreject,
  fetchPendingRejectedItems,
} = require("../../controller/restaurants/restaurant");
const router = express.Router();

router.post("/AddrestaurantAndAddresses", addrestaurant);

router.get("/sort", sortingANDsearching);
router.get("/fetchRestaurant/:id", fetchRestaurants);
router.get("/fetchAllRestaurants", fetchAllrestaurants);
router.get("/fetchAllUsers/:userID", fetchAllUsers);
router.get("/fetchByCategory", fetchByCategory);
router.post("/addItem", additem);
router.put("/updateUserStatus/:userID", updateUser);
router.delete("/deleteRestaurant/:restaurantID", deleteRestaurant);
router.put("/updateItem/:itemID", updateItem);
router.delete("/deleteItem/:itemID", deleteItem);
router.put("/approveORreject", approvalORreject);
router.get("/fetchPendingRejectedItems", fetchPendingRejectedItems);

router.delete("/reviews/:reviewID", deleteReview);
router.get("/reviews/:restaurantID", getReviews);
router.post("/reviews/:restaurantID", insertreviews);
// router.post("/customeraddresses");

module.exports = router;
