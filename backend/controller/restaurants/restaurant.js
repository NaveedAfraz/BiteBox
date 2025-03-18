const pool = require("../../db");

const addrestaurant = async (req, res) => {
  let connection;
  try {
    const {
      Name,
      city,
      street,
      PhoneNumber,
      Cuisine,
      OpeningHours,
      ClosingHours,
      postalCode,
      addressType,
      email,
      image,
      country,
    } = req.body;
    console.log(image, "image");

    if (!Name || !PhoneNumber || !Cuisine || !OpeningHours || !image) {
      console.log(Name, PhoneNumber, Cuisine, OpeningHours, image);
      return res
        .status(400)
        .json({ message: "All Restrdents fields are required" });
    }
    connection = await pool.getConnection();
    if (!Name || !addressType || !city || !street || !postalCode || !email) {
      console.log(city, street, postalCode);
      return res.status(400).json({ message: "All fields are required" });
    }

    await connection.beginTransaction();

    const query = "SELECT userID FROM USERS WHERE email = ?";
    const [result1] = await connection.execute(query, [email]);

    console.log(result1[0].userID);
    const { userID } = result1[0];
    const q = "SELECT * FROM Restaurant WHERE Name = ?";
    const [rows] = await connection.execute(q, [Name]);

    if (rows.status === "pending") {
      return res
        .status(400)
        .json({ message: "Restaurant is on pending approval" });
    }

    if (rows.length > 0 && rows.status === "rejected") {
      return res.status(400).json({ message: "Restaurant is rejected" });
    }

    if (rows.length > 0 && rows.status === "approved") {
      console.log(rows);
      return res.status(400).json({ message: "Restaurant already exists" });
    }
    console.log(userID, "userID");
    let status = "pending";
    const q1 =
      "INSERT INTO Restaurant (Name , PhoneNumber,Cuisine,OpeningHours,ClosingHours,userID,RestaurantImage,status) VALUES (?,?,?,?,?,?,?,?)";
    const [result] = await connection.execute(q1, [
      Name,
      PhoneNumber,
      Cuisine,
      OpeningHours,
      ClosingHours,
      userID,
      image,
      status,
    ]);
    const restaurantID = result.insertId;

    if (!country) {
      country = "United States";
    }
    const q2 =
      "INSERT INTO Address (Street, City, PostalCode, AddressType,country, UserID) VALUES (?,?,?,?,?,?)";
    const [result2] = await connection.execute(q2, [
      street,
      city,
      postalCode,
      addressType,
      country,
      userID,
    ]);
    console.log(result2);
    const addressID = result2.insertId;
    const q3 = "UPDATE Restaurant SET addressID = ? WHERE restaurantID = ?";
    const [result3] = await connection.execute(q3, [addressID, restaurantID]);
    console.log("Updated Restaurant with AddressID:", result3);

    if (result3.affectedRows === 1) {
      await connection.commit();
      return res.status(201).json({
        message: "Restaurant added successfully and Address linked",
        success: true,
      });
    } else {
      await connection.rollback();
      return res
        .status(500)
        .json({ message: "Failed to update restaurant with address" });
    }
  } catch (err) {
    console.log(err, "error creating restaurant for");
    if (connection) await connection.rollback();
    return res.status(500).json({ message: "Servefr error" });
  } finally {
    if (connection) connection.release();
  }
};

const approvalORreject = async (req, res) => {
  let connection;
  try {
    const { title, restaurantID, itemID, status } = req.body;
    console.log(title, restaurantID, itemID, status);

    if (!title || !status) {
      return res.status(400).json({
        message: "Title and status (status) are required",
      });
    }

    if (title === "restaurant" && !restaurantID) {
      return res.status(400).json({
        message: "Restaurant ID is required for restaurant update",
      });
    }

    if (title === "item" && !itemID) {
      return res.status(400).json({
        message: "Item ID is required for item update",
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    let result;
    if (title === "restaurant") {
      const query = "UPDATE Restaurant SET status = ? WHERE restaurantID = ?";
      [result] = await connection.execute(query, [status, restaurantID]);
    } else if (title === "item") {
      const query = "UPDATE items SET status = ? WHERE itemID = ?";
      [result] = await connection.execute(query, [status, itemID]);
    } else {
      return res.status(400).json({
        message: "Invalid title provided. Must be 'item' or 'restaurant'.",
      });
    }

    console.log("Update result:", result);

    if (result.affectedRows === 1) {
      await connection.commit();
      return res.status(200).json({
        message: `${title} status updated successfully`,
      });
    } else {
      await connection.rollback();
      return res
        .status(404)
        .json({ message: `${title} not found or update failed` });
    }
  } catch (err) {
    console.log("Error approving or rejecting:", err);
    await connection.rollback();
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  } finally {
    if (connection) connection.release();
  }
};

const fetchRestaurants = async function (req, res) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    connection.beginTransaction();
    if (!id) {
      return res.status(404).json({
        message: "Restaurant ID is required",
      });
    }
    console.log(id);

    const q = "SELECT * FROM Restaurant WHERE userID = ?";
    const [restaurantResult] = await connection.execute(q, [id]);
    console.log(restaurantResult);

    if (restaurantResult.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurants found for this user" });
    }

    const restaurantID = restaurantResult[0].restaurantID;
    const itemsQuery = "SELECT * FROM items WHERE restaurantID = ?";
    const ordersQuery = "SELECT * FROM orders WHERE restaurantID = ?";
    const reviewsQuery = "SELECT * FROM reviews WHERE restaurantID = ?";
    const [ordersResult] = await connection.execute(ordersQuery, [
      restaurantID,
    ]);

    const ordersDetailsQuery =
      "SELECT * FROM orderDetails WHERE orderID IN (SELECT orderID FROM orders WHERE restaurantID = ?)";
    const [ordersDetailsResult] = await connection.execute(ordersDetailsQuery, [
      restaurantID,
    ]);
    console.log(ordersDetailsResult, "ordersDetailsResult");

    const [itemsResult] = await connection.execute(itemsQuery, [restaurantID]);
    console.log(itemsResult, "items: ");

    const [reviewsResult] = await connection.execute(reviewsQuery, [
      restaurantID,
    ]); // Fetch reviews
    console.log(reviewsResult, "reviews: "); // Log reviews

    connection.commit();
    return res.status(200).json({
      message: "Restaurants and items fetched successfully",
      restaurant: restaurantResult[0],
      items: itemsResult,
      orders: ordersResult,
      ordersDetails: ordersDetailsResult,
      reviews: reviewsResult,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const cloudinary = require("../../cloudinary");
const additem = async function (req, res) {
  try {
    const {
      name,
      price,
      quantity,
      category,
      description,
      photoUrl,
      restaurantID,
    } = req.body;
    console.log(name, price, quantity, category, description, photoUrl);

    if (
      !name ||
      !price ||
      !quantity ||
      !category ||
      !description ||
      !photoUrl ||
      !restaurantID
    ) {
      console.log(restaurantID,"restaurantID",name,price,quantity,category,description);

      return res.status(400).json({
        message: "All fields are required",
      });
    }
    // const q1 = "SELECT * FROM Restaurant WHERE Name = ?";
    // const [result1] = await pool.query(q1, [name]);
    // if (result1.length === 0) {
    //   return res.status(400).json({ message: "Restaurant does not exist" });
    // }

    let photoUrlUrl = "";
    if (photoUrl) {
      const uploadedResponse = await cloudinary.uploader.upload(photoUrl, {
        upload_preset: "bitebox_menu_items",
      });
      photoUrlUrl = uploadedResponse.secure_url;
    }
    // let restaurantID = 31;
    let status = "pending";
    const q =
      "INSERT INTO items (Name, Amount, quantity, category, `desc`, img,restaurantID,status) VALUES (?,?,?,?,?,?,?,?)";
    const params = [
      name,
      price,
      quantity,
      category,
      description,
      photoUrlUrl,
      restaurantID,
      status,
    ];
    const result = await pool.query(q, params);
    console.log(result);

    return res.json({ message: "Item created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const fetchByCategory = async function (req, res) {
  try {
    const { category, restaurantID } = req.query;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    let q;
    let values = [];
    if (!restaurantID) {
      q = "SELECT * FROM items WHERE category = ?";
      values.push(category);
    } else {
      q = "SELECT * FROM items WHERE category = ? AND RestaurantID = ?";
      values.push(category, restaurantID);
    }
    const [result] = await pool.query(q, values);
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found in this category" });
    }
    console.log(result);
    return res
      .status(200)
      .json({ message: "Items found", data: result, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const fetchTopByBrand = async function (req, res) {
  try {
    const { brand } = req.query;
    if (!brand) {
      return res.status(400).json({ message: "Brand is required" });
    }
    const q = "SELECT * FROM Item WHERE Name LIKE?";
    const result = await pool.query(q, [`%${brand}%`]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No items found by this brand" });
    }
    return res
      .status(200)
      .json({ message: "Items found", data: result, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const sortingANDsearching = async (req, res) => {
  const { search, sort, order, foodType } = req.body;
  console.log(sort, order, foodType);

  try {
    let query;
    let values = [];

    // Building the base query
    if (foodType && !search) {
      query = `SELECT * FROM items WHERE foodType = ?`;
      values.push(foodType);
    } else if (search && !foodType) {
      query = `SELECT * FROM items WHERE Name LIKE ?`;
      values.push(`%${search}%`);
    } else if (search && foodType) {
      // Handle both search and foodType
      query = `SELECT * FROM items WHERE Name LIKE ? AND foodType = ?`;
      values.push(`%${search}%`, foodType);
    } else {
      query = `SELECT * FROM items`;
    }

    // Adding the ORDER BY clause
    if (sort) {
      switch (sort) {
        case "name":
          // Handle name sorting with the specified order
          query += ` ORDER BY Name ${order === "desc" ? "DESC" : "ASC"}`;
          break;
        case "Amount":
          // Handle price sorting with the specified order
          query += ` ORDER BY Amount ${order === "desc" ? "DESC" : "ASC"}`;
          break;
        case "discountedPrice":
          // Handle discounted price sorting with the specified order
          query += ` ORDER BY DiscountedPrice ${
            order === "desc" ? "DESC" : "ASC"
          }`;
          break;
        default:
          // Default sorting by Name ASC
          query += ` ORDER BY Name ASC`;
          break;
      }
    } else {
      // Default sorting if no sort parameter is provided
      query += ` ORDER BY Name ASC`;
    }

    console.log("Executing query:", query, "with values:", values);

    const [result] = await pool.execute(query, values);
    console.log(result);

    if (!result || result.length === 0) {
      return res.status(404).json({
        message: "No items found",
        success: false,
      });
    }

    res.json({
      message: "Items fetched successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    console.error("Error in sortingANDsearching:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};
const fetchAllRestaurantsRandItems = async (req, res) => {
  try {
    // First, fetch all restaurants
    const restaurantQuery = `SELECT * FROM Restaurant`;
    const [restaurants] = await pool.execute(restaurantQuery);
    console.log(restaurants, "rest");

    // For each restaurant, fetch up to 5 random items
    for (const restaurant of restaurants) {
      const itemsQuery = `
        SELECT * FROM items
        WHERE restaurantID= ?  
        ORDER BY RAND() 
        LIMIT 5
      `;
      const [items] = await pool.execute(itemsQuery, [restaurant.restaurantID]);

      // Add items to the restaurant object
      restaurant.menuItems = items;
    }

    res.json({
      message: "Restaurants with menu items fetched successfully",
      data: restaurants,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const fetchAllUsers = async (req, res) => {
  const { userID } = req.params;
  console.log(userID);

  if (!userID) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const query = "SELECT * FROM USERS WHERE userID != ?";
    const [result] = await pool.execute(query, [userID]);
    console.log(result);

    res.json({
      message: "Users fetched successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const { status } = req.body;
    console.log(userID, status);

    if (!userID || !status) {
      return res.status(400).json({ message: "ALL FILEDS ARE required" });
    }

    const query = "UPDATE USERS SET status =? WHERE userID =?";
    const [result] = await pool.execute(query, [status, userID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal Server Error" });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    console.log(restaurantID);
    if (!restaurantID) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
    const query = "DELETE FROM Restaurant WHERE restaurantID =?";
    const [result] = await pool.execute(query, [restaurantID]);
    console.log(result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal Server Error" });
  }
};
// Delete item endpoint
// Add this to your Express router in the backend
const deleteItem = async (req, res) => {
  try {
    const { itemID } = req.params;

    if (!itemID) {
      return res.status(404).json({ message: "Item not found" });
    }

    const query = "DELETE FROM items WHERE itemID =?";
    const [result] = await pool.execute(query, [itemID]);
    console.log(result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting item",
      error: error.message,
    });
  }
};

// Update item endpoint
// Add this to your Express router in the backend
const updateItem = async (req, res) => {
  try {
    const { itemID } = req.params;
    if (!itemID) {
      return res.status(404).json({
        success: false,
        message: "Item ID not found",
      });
    }
    const { name, description, price } = req.body;
    console.log(name, description, price, itemID);

    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const query =
      "UPDATE items SET Name = ?, `desc` = ?, Amount = ? WHERE itemID = ?";
    const [result] = await pool.execute(query, [
      name,
      description,
      price,
      itemID,
    ]);
    console.log(result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating item",
      error: error.message,
    });
  }
};

const insertreviews = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    const { rating, review } = req.body;
    console.log(restaurantID, rating, review);
    if (!restaurantID || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const query =
      "INSERT INTO reviews (userID,itemID,title,rating,review) VALUES (?,?,?,?,?)";

    const [result] = await pool.execute(query, [
      req.user.userID,
      restaurantID,
      "Sample Review",
      rating,
      review,
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
    const { reviewID } = req.params;

    if (!reviewID) {
      return res.status(400).json({
        success: false,
        message: "Review ID is required",
      });
    }

    const query = "DELETE FROM reviews WHERE reviewID = ?";
    const [result] = await pool.execute(query, [reviewID]);

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
    const { restaurantID, itemID } = req.query; // Fetch from query params

    if (!restaurantID && !itemID) {
      return res.status(400).json({
        success: false,
        message: "Either restaurantID or itemID is required",
      });
    }

    let query;
    let values;

    if (itemID) {
      // Fetch reviews for a specific item
      query = "SELECT * FROM reviews WHERE itemID = ?";
      values = [itemID];
    } else {
      // Fetch all reviews for a restaurant's items
      query = `
        SELECT r.* FROM reviews r
        JOIN menu_items m ON r.itemID = m.itemID
        WHERE m.restaurantID = ?
      `;
      values = [restaurantID];
    }

    const [rows] = await pool.execute(query, values);

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

const fetchPendingRejectedItems = async (req, res) => {
  try {
    const query =
      "SELECT * FROM items WHERE status = 'Pending' OR status = 'rejected'";
    const [rows] = await pool.execute(query);
    console.log(rows, "rejected items");

    return res.status(200).json({
      success: true,
      message: "rejected and pending items fetched",
      Items: rows,
    });
  } catch (error) {
    console.error("Error fetching pending restaurants:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pending restaurants",
      error: error.message,
    });
  }
};

const fetchOneRestaurant = (req, res) => {
  const restaurantID = req.params.restaurantID;
  try {
    const query = `SELECT * FROM Restaurant WHERE restaurantID = ?`;
    const values = [restaurantID];
    // const restaurantid = restaurantResult[0].restaurantID;
    const itemsQuery = "SELECT * FROM items WHERE restaurantID = ?";

    pool.execute(query, values).then(([rows]) => {
      const items = pool.execute(itemsQuery, [restaurantID]).then(([items]) => {
        return res.json({ restaurant: rows[0], items });
      });
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching restaurant" });
  }
};
module.exports = {
  addrestaurant,
  fetchRestaurants,
  additem,
  fetchAllRestaurantsRandItems,
  approvalORreject,
  fetchByCategory,
  fetchTopByBrand,
  updateUser,
  fetchAllUsers,
  sortingANDsearching,
  deleteRestaurant,
  deleteItem,
  updateItem,
  getReviews,
  deleteReview,
  insertreviews,
  fetchPendingRejectedItems,
  fetchOneRestaurant,
};
