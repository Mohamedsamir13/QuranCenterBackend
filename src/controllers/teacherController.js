const teacherService = require('../services/teacherService');

exports.getAll = async (req, res) => {
  try {
    console.log('⚙️ Controller: getAll triggered');
    const teachers = await teacherService.getAll();
    console.log('✅ Teachers fetched successfully');
    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (err) {
    // better logging for debugging
    console.error('❌ Error fetching teachers:', err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    // include real message for debug (remove before production)
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch teachers' });
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
  const { id } = req.params;
  const { studentId } = req.body;

  console.log('📩 Received request to add student:', studentId, 'to teacher:', id);

  if (!studentId) {
    return res.status(400).json({ success: false, message: "studentId required" });
  }

  try {
    await teacherService.addStudent(id, studentId);
    console.log('✅ Successfully added student', studentId, 'to teacher', id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('🔥 ERROR in addStudent:', error);
    res.status(500).json({ success: false, message: "Failed to add student" });
  }
};