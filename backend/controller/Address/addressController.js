const express = require("express");
const pool = require("../../db");

const addAddress = async (req, res) => {
  try {
    const {
      userID,
      city,
      street,
      building,
      postalCode,
      additionalInfo,
      addressType,
      country,
    } = req.body;

    // Validate required fields
    if (!userID || !city || !street || !postalCode) {
      return res
        .status(400)
        .json({ message: "Missing required address fields" });
    }

    const query = `
      INSERT INTO Address (
        userID, 
        city, 
        street, 
        building, 
        postalCode, 
        additionalInfo, 
        addressType,
        country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      userID,
      city,
      street,
      building || null,
      postalCode,
      additionalInfo || null,
      addressType || "Home",
      country || null,
    ]);

    return res.status(201).json({
      message: "Address added successfully",
      addressID: result.insertId,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding address" });
  }
};

const fetchAddress = async (req, res) => {
  try {
    const { userID } = req.params;
    console.log(userID);

    if (!userID) return res.status(404).json({ message: "userID not found" });

    const q = "SELECT * FROM Address WHERE userID = ?";
    const [rows] = await pool.execute(q, [userID]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Address not found" });
    }
    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Error fetching address:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching address" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressID, userID } = req.params;

    if (!addressID || !userID) {
      return res
        .status(400)
        .json({ message: "Both addressID and userID are required" });
    }

    // First check if the address belongs to the user
    const checkQuery =
      "SELECT * FROM Address WHERE addressID = ? AND userID = ?";
    const [checkResult] = await pool.execute(checkQuery, [addressID, userID]);

    if (checkResult.length === 0) {
      return res.status(404).json({
        message: "Address not found or you don't have permission to delete it",
      });
    }

    const deleteQuery =
      "DELETE FROM Address WHERE addressID = ? AND userID = ?";
    const [result] = await pool.execute(deleteQuery, [addressID, userID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Failed to delete address" });
    }

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting address" });
  }
};

module.exports = { addAddress, fetchAddress, deleteAddress };
