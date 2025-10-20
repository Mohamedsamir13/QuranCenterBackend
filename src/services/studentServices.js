const studentRepo = require('../repositories/studentRepository');

exports.getStudents = async () => await studentRepo.getAllStudents();
exports.getStudent = async (id) => await studentRepo.getStudentById(id);
exports.createStudent = async (data) => await studentRepo.addStudent(data);
exports.addReport = async (id, report) => await studentRepo.addReportToStudent(id, report);
