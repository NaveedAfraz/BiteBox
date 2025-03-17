const express = require("express");
const addItem = async function (req, res) {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const DeleteItem = async function (req, res) {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const getCart = async function (req, res) {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
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
