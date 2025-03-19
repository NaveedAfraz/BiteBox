const express = require("express");
const pool = require("../../db");

const addItem = async (req, res) => {
  try {
    const { userId, restaurantID, itemID, Name, Amount, img } = req.body;
    let quantity = 1;
    console.log(userId, restaurantID, itemID, Name, Amount, img, quantity);

    if (!userId || !restaurantID || !itemID || !Name || !Amount || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let cartId;
    const [existingCart] = await pool.execute(
      "SELECT cartID FROM Cart WHERE userID = ?",
      [userId]
    );

    if (existingCart.length === 0) {
      const [newCart] = await pool.execute(
        "INSERT INTO Cart (userID) VALUES (?)",
        [userId]
      );
      cartId = newCart.insertId;
    } else {
      cartId = existingCart[0].cartID;
    }

    const [existingItem] = await pool.execute(
      "SELECT id, quantity FROM cartItems WHERE cartID = ? AND itemID = ?",
      [cartId, itemID]
    );

    if (existingItem.length > 0) {
      const newQuantity = existingItem[0].quantity + quantity;
      const [updatedItem] = await pool.execute(
        "UPDATE cartItems SET quantity = ? WHERE id = ?",
        [newQuantity, existingItem[0].id]
      );

      if (updatedItem.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Item quantity updated in cart",
          cartId,
          updated: true,
          newQuantity,
        });
      }
    } else {
      const [addedItem] = await pool.execute(
        "INSERT INTO cartItems (cartID, restaurantID, itemID, title, amount, img, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [cartId, restaurantID, itemID, Name, Amount, img || null, quantity]
      );

      if (addedItem.affectedRows > 0) {
        // const q =
        //   "UPDATE items SET quantity = ? WHERE itemID = ? AND restaurantID = ?";
        // const [updatedItem] = await pool.execute(q, [
        //   Amount - quantity,
        //   itemID,
        //   restaurantID,
        // ]);
        return res.status(201).json({
          success: true,
          message: "Item added to cart successfully",
          cartId,
          updated: false,
        });
      }
    }

    return res.status(403).json({
      success: false,
      message: "Failed to add item to cart",
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

const DeleteItem = async (req, res) => {
  try {
    const { cartId, itemID, userId } = req.body;
    console.log(cartId, itemID, userId);

    if (!cartId || !itemID || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: cartId, itemID, and userId are required",
      });
    }

    const [cartCheck] = await pool.execute(
      "SELECT cartID FROM Cart WHERE cartID = ? AND userID = ?",
      [cartId, userId]
    );

    if (cartCheck.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Cart not found or does not belong to this user",
      });
    }

    const [itemCheck] = await pool.execute(
      "SELECT id, quantity FROM cartItems WHERE cartID = ? AND itemID = ?",
      [cartId, itemID]
    );

    if (itemCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found in the cart",
      });
    }

    const currentQuantity = itemCheck[0].quantity;

    if (currentQuantity <= 1) {
      await pool.execute("DELETE FROM cartItems WHERE id = ?", [
        itemCheck[0].id,
      ]);

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        remaining: 0,
      });
    } else {
      const newQuantity = currentQuantity - 1;
      await pool.execute("UPDATE cartItems SET quantity = ? WHERE id = ?", [
        newQuantity,
        itemCheck[0].id,
      ]);

      return res.status(200).json({
        success: true,
        message: "Item quantity reduced",
        remaining: newQuantity,
      });
    }
  } catch (error) {
    console.error("Error reducing item quantity:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reduce item quantity",
      error: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId, "ee");

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter: userId",
      });
    }

    const [cartResult] = await pool.execute(
      "SELECT cartID FROM Cart WHERE userID = ?",
      [userId]
    );

    if (cartResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cart found for this user",
      });
    }

    const cartId = cartResult[0].cartID;

    const [cartItems] = await pool.execute(
      "SELECT * FROM cartItems WHERE cartID = ?",
      [cartId]
    );

    return res.status(200).json({
      success: true,
      data: {
        cartId,
        userId,
        items: cartItems,
      },
    });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user cart",
      error: error.message,
    });
  }
};

// const addItem = async function (req, res) {
//   try {
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal Server error" });
//   }
// };
// const addItem = async function (req, res) {
//   try {
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal Server error" });
//   }
// };

module.exports = { addItem, DeleteItem, getCart };
