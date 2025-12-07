// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { getAllLimiter } = require("../middleWares/rateLimiter");

router.get("/", getAllLimiter, studentController.getAll);
router.post("/create-student", studentController.create);
router.get("/:id", studentController.getById);

// 🔥 NEW CRUD routes
router.put("/update-student/:id", studentController.update);

// Delete student
router.delete("/delete-student/:id", studentController.remove);

// Add report
router.post("/:id/reports", studentController.addReport);

module.exports = router;
