const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupsController");
const { verifyToken } = require("../middleWares/authMiddleware");
const { getAllLimiter, writeLimiter } = require("../middleWares/rateLimiter");

// GET all groups
router.get("/", getAllLimiter, groupController.getAll);

// Create group
router.post("/", verifyToken, writeLimiter, groupController.create);

// Get group by id
router.get("/:id", getAllLimiter, groupController.getById);

// Update group
router.put("/:id", verifyToken, writeLimiter, groupController.update);

// Delete group
router.delete("/:id", verifyToken, writeLimiter, groupController.remove);

// Add / Remove student
router.post("/:id/add-student", writeLimiter, groupController.addStudent);
router.post(
  "/:id/remove-student",
  verifyToken,
  writeLimiter,
  groupController.removeStudent,
);

module.exports = router;
