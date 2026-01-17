// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { getAllLimiter } = require("../middleWares/rateLimiter");

router.get("/", getAllLimiter, studentController.getAll);
router.post("/create-student", studentController.create);

// 🔥 NEW CRUD routes
router.put("/update-student/:id", studentController.update);

// Delete student
router.delete("/delete-student/:id", studentController.remove);

// Add report
router.post("/:id/reports", studentController.addReport);

// Add assignment
router.post("/:id/assignments", studentController.addAssignment);

// Get assignments
router.get("/:id/assignments", studentController.getAssignments);

// Update assignment
router.put(
  "/:id/assignments/:assignmentId",
  studentController.updateAssignment,
);

// Delete assignment
router.delete(
  "/:id/assignments/:assignmentId",
  studentController.deleteAssignment,
);
router.get("/:id", studentController.getById);

module.exports = router;
