// ...existing code...
const studentService = require("../services/studentServices");

// ✅ Get all students
exports.getAll = async (req, res) => {
  try {
    const students = await studentService.getStudents();
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch students" });
  }
};

// ✅ Create new student
exports.create = async (req, res) => {
  try {
    console.log("📥 Incoming Student Payload:", req.body);
    const { name, age, group, teacherId, riwaya, goal } = req.body;

    if (!name || !group) {
      return res.status(400).json({
        success: false,
        message: "name and group are required",
      });
    }

    const newStudent = await studentService.createStudent({
      name,
      age,
      group,
      teacherId: teacherId || null,
      riwaya: riwaya || "",
      goal: goal || null,
      reports: [],
    });

    res.status(201).json({
      success: true,
      message:
        "Student created successfully and assigned if teacherId provided",
      data: newStudent,
    });
  } catch (error) {
    console.error("❌ Error creating student:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create student",
    });
  }
};
// ✅ Get student by ID
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await studentService.getStudent(id);

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error("❌ Error fetching student by ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch student" });
  }
};

// ✅ Add new report to student
// studentController.js
exports.addReport = async (req, res) => {
  try {
    const id = req.params.id;
    const report = req.body;

    // ✅ بدل الفحص القديم
    const hasSuraList = Array.isArray(report.suraList) && report.suraList.length > 0;
    const hasSuraRanges = Array.isArray(report.suraRanges) && report.suraRanges.length > 0;

    if (!report.date || (!hasSuraList && !hasSuraRanges)) {
      return res.status(400).json({
        success: false,
        message: "Report must include date and either a sura list or a sura range",
      });
    }

    // Validate suraList if present
    if (hasSuraList && report.suraList.some((s) => !s.name || s.startAya == null || s.endAya == null)) {
      return res.status(400).json({
        success: false,
        message: "All items in suraList must have name, startAya, and endAya",
      });
    }

    // Validate suraRanges if present
    if (hasSuraRanges && report.suraRanges.some((r) => !r.fromSura || !r.toSura)) {
      return res.status(400).json({
        success: false,
        message: "All items in suraRanges must have fromSura and toSura",
      });
    }

    await studentService.addReport(id, report);

    res.status(200).json({
      success: true,
      message: "Report added successfully",
      data: report,
    });
  } catch (error) {
    console.error("❌ Error adding report:", error);
    res.status(500).json({ success: false, message: "Failed to add report" });
  }
};
// ✅ Update student
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updated = await studentService.updateStudent(id, updateData);

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updated,
    });
  } catch (e) {
    console.error("❌ Error updating student:", e);
    res
      .status(500)
      .json({ success: false, message: "Failed to update student" });
  }
};

// ✅ Delete student
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await studentService.deleteStudent(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (e) {
    console.error("❌ Error deleting student:", e);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete student" });
  }
};
exports.addAssignment = async (req, res) => {
  try {
    const studentId = req.params.id;
    const assignment = req.body;

    const hasSuraList = Array.isArray(assignment.suraList) && assignment.suraList.length > 0;
    const hasSuraRanges = Array.isArray(assignment.suraRanges) && assignment.suraRanges.length > 0;

    if (!assignment.sessionType || (!hasSuraList && !hasSuraRanges)) {
      return res.status(400).json({
        success: false,
        message: "Assignment must include sessionType and either a sura list or a sura range",
      });
    }

    // Validate suraList if present
    if (hasSuraList && assignment.suraList.some((s) => !s.name || s.startPage == null || s.endPage == null)) {
      return res.status(400).json({
        success: false,
        message: "All items in suraList must have name, startPage, and endPage",
      });
    }

    // Validate suraRanges if present
    if (hasSuraRanges && assignment.suraRanges.some((r) => !r.fromSura || !r.toSura)) {
      return res.status(400).json({
        success: false,
        message: "All items in suraRanges must have fromSura and toSura",
      });
    }

    const result = await studentService.addAssignment(studentId, assignment);

    res.status(200).json({
      success: true,
      message: "Assignment added successfully",
      data: result,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const studentId = req.params.id;
    const assignments = await studentService.getAssignments(studentId);
    res.status(200).json({ success: true, data: assignments });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id, assignmentId } = req.params;
    const data = req.body;

    const updated = await studentService.updateAssignment(
      id,
      assignmentId,
      data,
    );
    res.status(200).json({ success: true, data: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id, assignmentId } = req.params;
    await studentService.deleteAssignment(id, assignmentId);
    res.status(200).json({ success: true, message: "Assignment deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};
