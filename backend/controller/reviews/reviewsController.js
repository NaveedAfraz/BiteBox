const pool = require("../../db");
const insertreviews = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    const { rating, review, title, userID, itemID, orderID } = req.body;
    console.log(restaurantID, rating, review, userID, orderID);
    if (
      (!restaurantID || !rating || !review || userID === undefined || !itemID,
      orderID === undefined)
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const [reviewCheck] = await pool.execute(
      "SELECT * FROM reviews WHERE restaurantID = ? AND userID = ? AND itemID = ? AND orderID",
      [restaurantID, userID, itemID, orderID]
    );

    if (reviewCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this item",
      });
    }
    const query =
      "INSERT INTO reviews (restaurantID,userID,itemID,title,rating,context,orderID) VALUES (?,?,?,?,?,?,?)";

    const [result] = await pool.execute(query, [
      restaurantID,
      userID,
      itemID,
      title,
      rating,
      review,
      orderID,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error getting reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while getting reviews",
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewID, userID, restaurantID } = req.params;

    if (!reviewID || userID === undefined || restaurantID === undefined) {
      return res.status(400).json({
        success: false,
        message: "Review ID is required",
      });
    }

    const query =
      "DELETE FROM reviews WHERE reviewID = ? AND userID = ? AND restaurantID = ?";
    const [result] = await pool.execute(query, [
      reviewID,
      userID,
      restaurantID,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting review",
      error: error.message,
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const { restaurantID, itemID, orderID } = req.params;
    console.log(restaurantID, itemID, orderID);

    // if (!itemID) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Either restaurantID or item ID is required",
    //   });
    // }

    let query;
    let values;

    if (itemID) {
      query = "SELECT * FROM reviews WHERE itemID";
      values = [itemID, orderID];
    } else if (restaurantID == "null" && orderID == "null") {
      query = `
   SELECT * FROM reviews ORDER BY RAND() LIMIT 20`;
    } else {
      query = `
        SELECT r.* 
FROM reviews r
JOIN items m ON r.itemID = m.itemID
WHERE m.restaurantID = ? AND r.orderID = ?
      `;
      values = [restaurantID, orderID];
    }

    console.log(query, values);

    const [rows] = await pool.execute(query, values);
    console.log(rows, "resultaaas");

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reviews",
      error: error.message,
    });
  }
};

module.exports = { deleteReview, getReviews, insertreviews };