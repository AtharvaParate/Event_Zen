const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { auth } = require("../middleware/auth.middleware");

// Get current user profile
router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Get all users (admin only)
router.get("/", auth, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
