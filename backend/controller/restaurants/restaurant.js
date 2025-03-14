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
    } = req.body;
    if (!Name || !PhoneNumber || !Cuisine || !OpeningHours) {
      console.log(Name, PhoneNumber, Cuisine, OpeningHours);
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

    if (rows.length > 0) {
      console.log(rows);

      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const q1 =
      "INSERT INTO Restaurant (Name , PhoneNumber,Cuisine,OpeningHours,ClosingHours,userID) VALUES (?,?,?,?, ?,?)";
    const [result] = await connection.execute(q1, [
      Name,
      PhoneNumber,
      Cuisine,
      OpeningHours,
      ClosingHours,
      userID,
    ]);
    const restaurantID = result.insertId;
    console.log(userID);

    const q2 =
      "INSERT INTO Address (Street,  City, PostalCode, AddressType, UserID) VALUES (?,?,?,?,?)";
    const [result2] = await connection.execute(q2, [
      street,
      city,
      postalCode,
      addressType,
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
    console.log(err);
    if (connection) await connection.rollback();
    return res.status(500).json({ message: "Server error" });
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
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const additem = async function () {
  try {
    const {
      restaurantID,
      Name,
      price,
      discountedprice,
      quantity,
      description,
      category,
    } = req.body;

    if (
      !restaurantID ||
      !Name ||
      !price ||
      !discountedprice ||
      !quantity ||
      !description ||
      !category
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const q = "SELECT * FROM Restaurant WHERE Name = ?";
    const [result] = await pool.query(q, [Name]);
    if (result.length === 0) {
      return res.status(400).json({ message: "Restaurant does not exist" });
    }

    const q1 =
      "INSERT INTO Item (Name, Price, DiscountedPrice, Quantity, Description, Category, RestaurantID) VALUES (?,?,?,?,?,?,?)";
    const result1 = await pool.query(q1, [
      Name,
      price,
      discountedprice,
      quantity,
      description,
      category,
      restaurantID,
    ]);

    if (result1.affectedRows >= 1) {
      return res.status(201).json({ message: "Item added successfully" });
    }
    return res.status(500).json({ message: "Failed to add item" });
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
  const { search, sort, order, foodType } = req.query;
  try {
    let query;
    let values = [];
    if (foodType && !search) {
      query = `SELECT * FROM items WHERE foodType = ?`;
      values.push(foodType);
    } else if (search && !foodType) {
      query = `SELECT * FROM items WHERE Name LIKE ?`;
      values.push(`%${search}%`);
    } else {
      query = `SELECT * FROM items WHERE foodType = ? AND Name LIKE?`;
      values.push(foodType, `%${search}%`);
    }

    switch (sort) {
      case "name":
        query += " ORDER BY Name";
        break;
      case "price":
        const orderBy = order === "desc" ? "DESC" : "ASC";
        query += ` ORDER BY ${sort} ${orderBy}`;
        break;
      case "discountedPrice":
        query += " ORDER BY DiscountedPrice";
        break;
      default:
        query += " ORDER BY Name";
        break;
    }

    const [result] = await pool.execute(query, values);
    if (result.length === 0) {
      return res.status(404).json({ message: "No items found" });
    }
    res.json({
      message: "Items fetched successfully",
      data: result[0],
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const fetchAllrestaurants = async (req, res) => {
  try {
    const query = `SELECT * FROM restaurant`;
    const [result] = await pool.execute(query);
    res.json({
      message: "Restaurant fetched successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const fetchAllUSers = async (req, res) => {
  const { userID } = req.query;
  if (!userID) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const query = "SELECT * FROM USERS WHERE userID != ?";
    const [result] = await pool.execute(query);
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

module.exports = {
  addrestaurant,
  fetchRestaurants,
  additem,
  fetchAllrestaurants,
  fetchByCategory,
  fetchTopByBrand,
  sortingANDsearching,
};
