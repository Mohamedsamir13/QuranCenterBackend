// ...existing code...
const studentService = require('../services/studentServices');

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
    console.error('❌ Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

// ✅ Create new student
exports.create = async (req, res) => {
  try {
    console.log('📥 Incoming Student Payload:', req.body);
    const { name, age, group, teacherId, riwaya, goal } = req.body;

    if (!name || !group) {
      return res.status(400).json({ success: false, message: 'name and group are required' });
    }

    // ✅ call createStudent (NOT addStudent)
    const newStudent = await studentService.createStudent({
      name,
      age,
      group,
      teacherId: teacherId || null,
      riwaya: riwaya || '',
      goal: goal || null,
      reports: [],
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent,
    });
  } catch (error) {
    console.error('❌ Error creating student:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get student by ID
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await studentService.getStudent(id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error('❌ Error fetching student by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student' });
  }
};

// ✅ Add new report to student
exports.addReport = async (req, res) => {
  try {
    const id = req.params.id;
    const report = req.body;

    if (!report.date || !report.sura) {
      return res.status(400).json({ success: false, message: 'Report must include date and sura' });
    }

    await studentService.addReport(id, report);

    res.status(200).json({
      success: true,
      message: 'Report added successfully',
      data: report,
    });
  } catch (error) {
    console.error('❌ Error adding report:', error);
    res.status(500).json({ success: false, message: 'Failed to add report' });
  }
};
// ...existing code...