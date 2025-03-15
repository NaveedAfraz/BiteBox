const pool = require("../../db");

const loginIn = async (req, res) => {
  try {
    let { username, password, role, email } = req.body;
    console.log(role, username, password, email);

    if (!role) {
      role = "customer"; // Default role if not provided in the request body.
    }
    if (!email || !role) {
      console.log("Some required fields not found");
      console.log(username, password, role);

      return res
        .status(400)
        .json({ message: "Username, password, and role are required" });
    }

    const query = "SELECT * FROM USERS WHERE email = ?";
    const [rows] = await pool.execute(query, [email]);
    console.log(rows);
    let status = "active";
    if (rows.length === 0 && password === null) {
      const query1 =
        "INSERT INTO USERS (email, role ,userName,status) VALUES (?, ?, ?,?)";
      const values2 = [email, role, username, status];

      // Execute the query
      const result = await pool.query(query1, values2);

      if (result.affectedRows === 0) {
        console.log("No rows affected");
        return res
          .status(500)
          .json({ message: "Failed to insert user into the database" });
      }
      return res
        .status(200)
        .json({ message: "User inserted successfully", result });
    }

    return res.status(404).json({ message: "already in the database" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const signUp = async (req, res) => {
  try {
    const { email, role, username } = req.body;
    console.log(email, role, username);

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    const checkUserQuery = "SELECT * FROM USERS WHERE email = ?";
    const [existingUsers] = await pool.execute(checkUserQuery, [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
    let status = "active";
    const insertUserQuery =
      "INSERT INTO USERS (email, role,userName , status) VALUES (?,?,?,?)";
    const [result] = await pool.execute(insertUserQuery, [
      email,
      role,
      username,
      status,
    ]);

    if (result.affectedRows === 1) {
      return res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    } else {
      return res.status(500).json({ message: "Failed to register user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const query = "SELECT * FROM USERS WHERE email = ?";
    const [rows] = await pool.execute(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDetails = {
      userId: rows[0].userID,
      email: rows[0].email,
      role: rows[0].role,
    };

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { loginIn, signUp, getUserDetails };
