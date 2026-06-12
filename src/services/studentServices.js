// services/studentServices.js
const studentRepo = require("../repositories/studentRepositories");

exports.getStudents = async (page, limit) => studentRepo.getAllStudents(page, limit);
exports.getStudent = async (id) => studentRepo.getStudentById(id);
exports.createStudent = async (data) => studentRepo.addStudent(data);
exports.addReport = async (id, report) =>
  studentRepo.addReportToStudent(id, report);

exports.updateStudent = async (id, data) => studentRepo.updateStudent(id, data);
exports.deleteStudent = async (id) => studentRepo.deleteStudent(id);

// Report Services
exports.getReports = async (studentId) =>
  studentRepo.getReportsForStudent(studentId);

exports.getReportById = async (studentId, reportId) =>
  studentRepo.getReportById(studentId, reportId);

exports.updateReport = async (studentId, reportId, data) =>
  studentRepo.updateReport(studentId, reportId, data);

exports.deleteReport = async (studentId, reportId) =>
  studentRepo.deleteReport(studentId, reportId);
///Assignment Services
exports.addAssignment = async (studentId, assignment) =>
  studentRepo.addAssignmentToStudent(studentId, assignment);

exports.getAssignments = async (studentId) =>
  studentRepo.getAssignmentsForStudent(studentId);

exports.updateAssignment = async (studentId, assignmentId, data) =>
  studentRepo.updateAssignment(studentId, assignmentId, data);

exports.deleteAssignment = async (studentId, assignmentId) =>
  studentRepo.deleteAssignment(studentId, assignmentId);
