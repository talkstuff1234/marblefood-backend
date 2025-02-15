require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Configure CORS
app.use(
  cors({
    origin: [
      process.env.LOCALHOST_ORIGIN_URL,
      process.env.WEBSITE_ORIGIN_URL,
      process.env.TEST_WEBSITE_ORIGIN_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Define a simple route
app.get("/", (req, res) => res.send("Express on Vercel"));

// Import and use API routes
const productRoutes = require("./routes/productRoutes");
app.use("/api", productRoutes);

// const userRoutes = require("./routes/userRoutes");
// app.use("/api/users", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ code: 500, message: "Internal Server Error", body: {} });
  next(err);
});

// Start the server
const PORT = process.env.PORT || 1711;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
