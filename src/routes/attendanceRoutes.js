const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { verifyToken } = require("../middleWares/authMiddleware");
const { getAllLimiter, writeLimiter } = require("../middleWares/rateLimiter");

// Sessions
router.post("/sessions", writeLimiter, attendanceController.getOrCreateSession);
router.get("/sessions/today", getAllLimiter, attendanceController.getTodaySessions);

// Attendance Marking
router.get("/sessions/:sessionId/attendance", getAllLimiter, attendanceController.getSessionAttendance);
router.post("/sessions/:sessionId/attendance", writeLimiter, attendanceController.saveSessionAttendance);
router.post("/sessions/:sessionId/extra-student", writeLimiter, attendanceController.addExtraStudent);

// Student Summary
router.get("/students/:studentId/attendance", getAllLimiter, attendanceController.getStudentAttendanceSummary);

// Analytics & Audit
router.get("/analytics", getAllLimiter, attendanceController.getAcademyAnalytics);
router.get("/today/absences", getAllLimiter, attendanceController.getTodayAbsences);
router.get("/today/stats", getAllLimiter, attendanceController.getTodayStats);
router.get("/groups/:groupId/stats", getAllLimiter, attendanceController.getGroupAttendanceStats);
router.get("/audit", getAllLimiter, attendanceController.getAuditLogs);

module.exports = router;
