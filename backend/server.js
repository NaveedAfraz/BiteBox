const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cloudinary = require("./cloudinary");

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
app.use(
  cors({
    origin: "http://localhost:5173",
    method: ["POST", "GET", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

dotenv.config();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
const { clerkClient } = require("@clerk/clerk-sdk-node");
app.post("/update-user-metadata", async (req, res) => {
  const { userId, role } = req.body;

  try {
    const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const port = 3006;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
