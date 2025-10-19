const teacherRepo = require('../repositories/teacherRepo');

exports.getAll = async () => {
  return await teacherRepo.getAllTeachers();
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
