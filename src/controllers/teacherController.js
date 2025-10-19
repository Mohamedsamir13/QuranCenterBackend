const teacherService = require('../services/teacherService');

// ✅ Get all teachers
exports.getAll = async (req, res) => {
  try {
    const teachers = await teacherService.getAll();
    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (err) {
    console.error('❌ Error fetching teachers:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch teachers' });
  }
};

// ✅ Get teacher by ID
exports.getById = async (req, res) => {
  try {
    const teacher = await teacherService.getById(req.params.id);
    if (!teacher)
      return res.status(404).json({ success: false, message: 'Teacher not found' });

    res.status(200).json({ success: true, data: teacher });
  } catch (err) {
    console.error('❌ Error fetching teacher:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch teacher' });
  }
};

// ✅ Create teacher
exports.create = async (req, res) => {
  try {
    const { name, students = [] } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: 'name is required' });

    const newTeacher = await teacherService.create({ name, students });
    res.status(201).json({ success: true, data: newTeacher });
  } catch (err) {
    console.error('❌ Error creating teacher:', err);
    res.status(500).json({ success: false, message: 'Failed to create teacher' });
  }
};

// ✅ Add student to teacher
exports.addStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const teacherId = req.params.id;
    if (!studentId)
      return res.status(400).json({ success: false, message: 'studentId required' });

    await teacherService.addStudent(teacherId, studentId);
    res.status(200).json({ success: true, message: 'Student added successfully' });
  } catch (err) {
    console.error('❌ Error adding student:', err);
    res.status(500).json({ success: false, message: 'Failed to add student' });
  }
};
