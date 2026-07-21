const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const { verifyToken } = require("../middleWares/authMiddleware");
const { getAllLimiter, writeLimiter } = require("../middleWares/rateLimiter");

// Student Recurring Schedules
router.get("/students/:studentId/schedule", getAllLimiter, scheduleController.getStudentSchedule);
router.post("/students/:studentId/schedule", writeLimiter, scheduleController.setStudentSchedule);
router.delete("/student-schedules/:scheduleId", writeLimiter, scheduleController.deleteSchedule);

// Student Schedule Exceptions
router.get("/students/:studentId/exceptions", getAllLimiter, scheduleController.getStudentExceptions);
router.post("/students/:studentId/exceptions", writeLimiter, scheduleController.addScheduleException);
router.delete("/schedule-exceptions/:id", writeLimiter, scheduleController.deleteException);

module.exports = router;
