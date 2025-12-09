// routes/groupRoutes.js
const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupsController");
const { verifyToken } = require("../middleWares/authMiddleware");
const { getAllLimiter } = require("../middleWares/rateLimiter");

// ✅ كل الراوتس دي مش هتشتغل إلا لو فيه توكن صحيح

// GET /api/groups
router.get("/", getAllLimiter, groupController.getAll);

// POST /api/groups
router.post("/", verifyToken, groupController.create);

// GET /api/groups/:id
router.get("/:id", verifyToken, groupController.getById);

// PUT /api/groups/:id
router.put("/:id", verifyToken, groupController.update);

// DELETE /api/groups/:id
router.delete("/:id", verifyToken, groupController.remove);

// Add / Remove student in a group
router.post("/:id/add-student", verifyToken, groupController.addStudent);
router.post("/:id/remove-student", verifyToken, groupController.removeStudent);

module.exports = router;
