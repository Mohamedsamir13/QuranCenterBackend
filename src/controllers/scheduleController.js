// controllers/scheduleController.js
const scheduleRepo = require("../repositories/scheduleRepository");

exports.getStudentSchedule = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schedules = await scheduleRepo.getStudentSchedules(studentId);
    res.json({ status: "success", data: schedules });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.setStudentSchedule = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { groupId, days } = req.body;
    if (!groupId || !Array.isArray(days)) {
      return res.status(400).json({ status: "error", message: "groupId and days array are required" });
    }
    const created = await scheduleRepo.setStudentSchedules(studentId, groupId, days);
    res.json({ status: "success", data: created });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    await scheduleRepo.deleteSchedule(scheduleId);
    res.json({ status: "success", message: "Schedule deleted" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.addScheduleException = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { groupId, date, exceptionType, notes } = req.body;
    if (!groupId || !date || !exceptionType) {
      return res.status(400).json({ status: "error", message: "groupId, date, and exceptionType are required" });
    }
    const exception = await scheduleRepo.addScheduleException({
      studentId,
      groupId,
      date,
      exceptionType,
      notes: notes || "",
      createdBy: req.user ? req.user.name : "Manager",
    });
    res.json({ status: "success", data: exception });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.getStudentExceptions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date } = req.query;
    const exceptions = await scheduleRepo.getStudentExceptions(studentId, date);
    res.json({ status: "success", data: exceptions });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

exports.deleteException = async (req, res) => {
  try {
    const { id } = req.params;
    await scheduleRepo.deleteException(id);
    res.json({ status: "success", message: "Exception deleted" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};
