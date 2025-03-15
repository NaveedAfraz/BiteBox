const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cloudinary = require("./cloudinary");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const authRoute = require("./routes/auth/authRoute");
const restaurantRoute = require("./routes/restaurants/restaurant");
const pool = require("./db");

app.use("/api/auth", authRoute);
app.use("/api/restaurant", restaurantRoute);
const port = 3006;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
