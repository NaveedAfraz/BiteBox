const express = require("express");
const { loginIn } = require("../../controller/auth/controller");
const router = express.Router();

// Define the POST route for login (or sign-up)
router.post("/auth/login", loginIn);

module.exports = router;
