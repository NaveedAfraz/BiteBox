const express = require("express");
const {
  loginIn,
  signUp,
  getUserDetails,
} = require("../../controller/auth/authController");
const router = express.Router();

// Define the POST route for login (or sign-up)
router.post("/auth/login", loginIn);
router.post("/auth/signup", signUp);
router.get("/auth/loggedIn/:email", getUserDetails);
module.exports = router;
