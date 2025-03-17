const express = require("express");

const addAddress = () => {
  try {
    //Add Address logic here
    //Return success message
    return res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding address" });
  }
};

const fetchAddress = () => {
  try {
    //Add Address logic here
    //Return success message
    return res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding address" });
  }
};

const deleteAddress = () => {
  try {
    //Add Address logic here
    //Return success message
    return res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding address" });
  }
};

module.exports = { addAddress, fetchAddress, deleteAddress };
