const express = require("express");
const {
  loginIn,
  signUp,
  getUserDetails,
} = require("../../controller/auth/authController");
const router = express.Router();

// Define the POST route for login (or sign-up)
router.post("/login", loginIn);
router.post("/signup", signUp);
router.get("/loggedIn/:email", getUserDetails);
module.exports = router;
