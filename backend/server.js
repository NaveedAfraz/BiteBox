const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    method: [POST, GET, PUT, DELETE],
  })
);

dotenv.config();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 3006;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
