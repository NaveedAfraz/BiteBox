const pool = require("../../db");

const loginIn = async (req, res) => {
  try {
    let { username, password, role, email } = req.body;
   
    if (!email || !password) {
      console.log("Some required fields not found");
      console.log(username, password, role);

      return res
        .status(400)
        .json({ message: "Username, password, and role are required" });
    }

    const query = "INSERT INTO USERS (email, role) VALUES ( ?, ?)";
    const values = [email, role = "customer"];

    // Execute the query
    const result = await pool.query(query, values);

    if (result.affectedRows === 0) {
      console.log("No rows affected");
      return res
        .status(500)
        .json({ message: "Failed to insert user into the database" });
    }
    return res
      .status(200)
      .json({ message: "User inserted successfully", result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { loginIn };