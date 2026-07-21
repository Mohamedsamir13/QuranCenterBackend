const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { getAllLimiter, writeLimiter } = require("../middleWares/rateLimiter");
const { verifyToken } = require("../middleWares/authMiddleware");

const restrictToStaff = (req, res, next) => {
  if (!req.user || (req.user.type !== "Manager" && req.user.type !== "Teacher" && req.user.type !== "Assistant")) {
    return res.status(403).json({ message: "Access denied: Managers, Teachers and Assistants only" });
  }
  next();
};

router.get("/", getAllLimiter, studentController.getAll);
router.get("/:id", getAllLimiter, studentController.getById);

router.post("/create-student", verifyToken, restrictToStaff, writeLimiter, studentController.create);
router.put("/update-student/:id", verifyToken, restrictToStaff, writeLimiter, studentController.update);
router.delete("/delete-student/:id", verifyToken, restrictToStaff, writeLimiter, studentController.remove);

// Reports
router.post("/:id/reports", verifyToken, restrictToStaff, writeLimiter, studentController.addReport);
router.get("/:id/reports", getAllLimiter, studentController.getReports);
router.get("/:id/reports/:reportId", getAllLimiter, studentController.getReportById);
router.put("/:id/reports/:reportId", verifyToken, restrictToStaff, writeLimiter, studentController.updateReport);
router.delete("/:id/reports/:reportId", verifyToken, restrictToStaff, writeLimiter, studentController.deleteReport);

// Assignments
router.post("/:id/assignments", verifyToken, restrictToStaff, writeLimiter, studentController.addAssignment);
router.get("/:id/assignments", getAllLimiter, studentController.getAssignments);
router.put(
  "/:id/assignments/:assignmentId",
  verifyToken,
  restrictToStaff,
  writeLimiter,
  studentController.updateAssignment,
);
router.delete(
  "/:id/assignments/:assignmentId",
  verifyToken,
  restrictToStaff,
  writeLimiter,
  studentController.deleteAssignment,
);

module.exports = router;
