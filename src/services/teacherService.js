const teacherRepo = require("../repositories/teacherRepo");

exports.getAll = async () => {
  try {
    return await teacherRepo.getAllTeachers();
  } catch (err) {
    console.error("⚠️ Error inside teacherService.getAll:", err.message);
    throw new Error(`[ServiceError] ${err.message || err}`);
  }
};

exports.getById = async (id) => {
  return await teacherRepo.getTeacherById(id);
};

exports.create = async (data) => {
  return await teacherRepo.addTeacher(data);
};

exports.addStudent = async (teacherId, studentId) => {
  return await teacherRepo.addStudentToTeacher(teacherId, studentId);
};

// 🟡 Update teacher (name أو غيره)
exports.update = async (id, data) => {
  return await teacherRepo.updateTeacher(id, data); // 👈 NEW
};

// 🔴 Delete teacher
exports.remove = async (id) => {
  return await teacherRepo.deleteTeacher(id); // 👈 NEW
};
