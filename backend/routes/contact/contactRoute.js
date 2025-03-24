const express = require("express");
const { fetchMessages } = require("../../controller/Contact/contactController");
const router = express.Router();

router.get("/fetchMessages/:userId", fetchMessages);
module.exports = router;
