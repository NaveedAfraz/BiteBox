const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: "./.env" });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  port: process.env.DB_PORT || 22701,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database!");
    connection.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

testConnection();
module.exports = pool;
