const express = require("express");
const {
  deleteReview,
  insertreviews,
  getReviews,
} = require("../../controller/reviews/reviewsController");
const router = express.Router();

router.post("/addReview/:restaurantID", insertreviews);
router.delete("/deleteReview/:userID/:reviewID", deleteReview);
router.get("/getReviews/:restaurantID/:orderID", getReviews);

module.exports = router;
