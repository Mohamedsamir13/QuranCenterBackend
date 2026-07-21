// controllers/attendanceController.js
const attendanceRepo = require("../repositories/attendanceRepository");

exports.getOrCreateSession = async (req, res) => {
  try {
    const { groupId, date, startTime, endTime, teacherId } = req.body;
    if (!groupId || !date) {
      return res.status(400).json({ status: "error", message: "groupId and date are required" });
    }
    const session = await attendanceRepo.getOrCreateSession({ groupId, date, startTime, endTime, teacherId });
    res.json({ status: "success", data: session });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.getTodaySessions = async (req, res) => {
  try {
    const { teacherId, date } = req.query;
    const sessions = await attendanceRepo.getTodaySessions(teacherId, date);
    res.json({ status: "success", data: sessions });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.getSessionAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const details = await attendanceRepo.getSessionAttendanceDetails(sessionId);
    if (!details) {
      return res.status(404).json({ status: "error", message: "Session not found" });
    }
    res.json({ status: "success", data: details });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.saveSessionAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { attendance } = req.body;
    if (!Array.isArray(attendance)) {
      return res.status(400).json({ status: "error", message: "attendance array is required" });
    }
    const markedBy = req.user ? req.user.name : "Teacher";
    await attendanceRepo.saveSessionAttendance(sessionId, attendance, markedBy);
    res.json({ status: "success", message: "Attendance saved and session completed" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.addExtraStudent = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { studentId, status } = req.body;
    if (!studentId) {
      return res.status(400).json({ status: "error", message: "studentId is required" });
    }
    const markedBy = req.user ? req.user.name : "Teacher";
    const record = await attendanceRepo.addExtraStudent(sessionId, studentId, status || "PRESENT", markedBy);
    res.json({ status: "success", data: record });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.getStudentAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const summary = await attendanceRepo.getStudentAttendanceSummary(studentId);
    res.json({ status: "success", data: summary });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.getAcademyAnalytics = async (req, res) => {
  try {
    const { dateRange } = req.query;
    const analytics = await attendanceRepo.getAcademyAttendanceAnalytics(dateRange);
    res.json({ status: "success", data: analytics });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const { sessionId, studentId } = req.query;
    const logs = await attendanceRepo.getAuditLogs(sessionId, studentId);
    res.json({ status: "success", data: logs });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};
