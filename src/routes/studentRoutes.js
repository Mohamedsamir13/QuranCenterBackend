const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { getAllLimiter, writeLimiter } = require("../middleWares/rateLimiter");
router.get("/", getAllLimiter, studentController.getAll);
router.get("/:id", getAllLimiter, studentController.getById);
router.post("/create-student", writeLimiter, studentController.create);
router.put("/update-student/:id", writeLimiter, studentController.update);
router.delete("/delete-student/:id", writeLimiter, studentController.remove);
// Reports
router.post("/:id/reports", writeLimiter, studentController.addReport);
router.get("/:id/reports", getAllLimiter, studentController.getReports);
router.get("/:id/reports/:reportId", getAllLimiter, studentController.getReportById);
router.put("/:id/reports/:reportId", writeLimiter, studentController.updateReport);
router.delete("/:id/reports/:reportId", writeLimiter, studentController.deleteReport);
// Assignments
router.post("/:id/assignments", writeLimiter, studentController.addAssignment);
router.get("/:id/assignments", getAllLimiter, studentController.getAssignments);
router.put(
  "/:id/assignments/:assignmentId",
  writeLimiter,
  studentController.updateAssignment,
);
router.delete(
  "/:id/assignments/:assignmentId",
  writeLimiter,
  studentController.deleteAssignment,
);
module.exports = router;
