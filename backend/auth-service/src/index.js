require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./models");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Auth service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
