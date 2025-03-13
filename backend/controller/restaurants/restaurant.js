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
      console.log(address, city, street, postalCode);
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
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const q1 =
      "INSERT INTO Restaurant (Name , PhoneNumber,Cuisine,OpeningHours,ClosingHours) VALUES (?,?,?,?, ?)";
    const [result] = await connection.execute(q1, [
      Name,
      PhoneNumber,
      Cuisine,
      OpeningHours,
      ClosingHours,
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
      return res
        .status(201)
        .json({ message: "Restaurant added successfully and Address linked" , success: true});
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

module.exports = { addrestaurant, additem };
