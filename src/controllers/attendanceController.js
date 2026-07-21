// controllers/attendanceController.js
const attendanceRepo = require("../repositories/attendanceRepository");

exports.getOrCreateSession = async (req, res) => {
  try {
    const { groupId, date, startTime, endTime, teacherId, studentIds, students } = req.body;
    if (!groupId || !date) {
      return res.status(400).json({ status: "error", message: "groupId and date are required" });
    }
    const session = await attendanceRepo.getOrCreateSession({
      groupId,
      date,
      startTime,
      endTime,
      teacherId,
      studentIds: studentIds || [],
      students: students || [],
    });
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
    const { date, dateRange } = req.query;
    const analytics = await attendanceRepo.getAcademyAttendanceAnalytics(date || dateRange);
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

exports.getTodayAbsences = async (req, res) => {
  try {
    const { date } = req.query;
    const absences = await attendanceRepo.getTodayAbsences(date);
    res.json({ status: "success", data: absences });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.getTodayStats = async (req, res) => {
  try {
    const { date } = req.query;
    const stats = await attendanceRepo.getTodayStats(date);
    res.json({ status: "success", data: stats });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.getGroupAttendanceStats = async (req, res) => {
  try {
    const { groupId } = req.params;
    const stats = await attendanceRepo.getGroupAttendanceStats(groupId);
    res.json({ status: "success", data: stats });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

