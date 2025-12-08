const express = require("express");
const {
  register,
  login,
  getAllUsers,
} = require("../controllers/authController");

// middlewares
const { loginLimiterByEmail } = require("../middleWares/rateLimiter");
const { verifyToken } = require("../middleWares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiterByEmail, login);
const onlyManager = (req, res, next) => {
  if (!req.user || req.user.type !== "Manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }
  next();
};

// 🔐 protected route – لازم JWT + لازم يكون Manager
router.get("/getAllUsers", verifyToken, onlyManager, getAllUsers);
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "✅ Token is valid",
    user: req.user,
  });
});

module.exports = router;
