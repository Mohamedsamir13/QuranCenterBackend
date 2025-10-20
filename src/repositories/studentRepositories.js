const { db } = require('../config/firebase');
const StudentModel = require('../models/studentModel');
const ReportModel = require('../models/reportModel');

const studentsCollection = db.collection('students');

// ✅ Get All Students (basic info)
exports.getAllStudents = async () => {
  const snapshot = await studentsCollection.get();
  return snapshot.docs.map(StudentModel.fromFirestore);
};

// ✅ Get Student by ID (with reports)
exports.getStudentById = async (id) => {
  const studentDoc = await studentsCollection.doc(id).get();
  if (!studentDoc.exists) return null;

  const student = StudentModel.fromFirestore(studentDoc);

  // Fetch subcollection reports
  const reportsSnap = await studentsCollection.doc(id).collection('reports').get();
  const reports = reportsSnap.docs.map(ReportModel.fromFirestore);

  return { ...student, reports };
};

// ✅ Create Student
exports.addStudent = async (studentData) => {
  const student = new StudentModel(studentData);
  const docRef = await studentsCollection.add(student.toFirestore());
  await docRef.update({ id: docRef.id });
  return new StudentModel({ ...studentData, id: docRef.id });
};

// ✅ Add report under subcollection
exports.addReportToStudent = async (studentId, reportData) => {
  const report = new ReportModel(reportData);
  const reportsRef = studentsCollection.doc(studentId).collection('reports');
  const reportRef = await reportsRef.add(report.toFirestore());
  await reportRef.update({ id: reportRef.id });
  return new ReportModel({ ...reportData, id: reportRef.id });
};
