const studentRepo = require('../repositories/studentRepositories');

exports.getStudents = async () => {
  return await studentRepo.getAllStudents();
};

exports.createStudent = async (data) => {
  return await studentRepo.addStudent(data);
};

exports.getStudent = async (id) => {
  return await studentRepo.getStudentById(id);
};

exports.addReport = async (id, report) => {
  return await studentRepo.addReportToStudent(id, report);
};
