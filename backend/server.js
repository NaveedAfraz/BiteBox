const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cloudinary = require("./cloudinary");

app.use(
  cors({
    origin: "http://localhost:5173", // allow requests from your client
    credentials: true, // allow credentials (cookies, auth headers)
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const authRoute = require("./routes/auth/authRoute");
app.use("/api", authRoute);
const port = 3006;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
