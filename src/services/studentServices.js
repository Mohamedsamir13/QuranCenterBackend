// services/studentServices.js
const studentRepo = require("../repositories/studentRepositories");

exports.getStudents = async () => studentRepo.getAllStudents();
exports.getStudent = async (id) => studentRepo.getStudentById(id);
exports.createStudent = async (data) => studentRepo.addStudent(data);
exports.addReport = async (id, report) =>
  studentRepo.addReportToStudent(id, report);

// 🔥 New CRUD:
exports.updateStudent = async (id, data) => studentRepo.updateStudent(id, data);
exports.deleteStudent = async (id) => studentRepo.deleteStudent(id);
