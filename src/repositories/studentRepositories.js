const { db, admin } = require('../config/firebase');
const StudentModel = require('../models/studentModel');
const ReportModel = require('../models/reportModel');

const studentsCollection = db.collection('students');
const teachersCollection = db.collection('teachers');

// ✅ Get All Students
exports.getAllStudents = async () => {
  const snapshot = await studentsCollection.get();
  return snapshot.docs.map(StudentModel.fromFirestore);
};

// ✅ Get Student by ID (with reports)
exports.getStudentById = async (id) => {
  const studentDoc = await studentsCollection.doc(id).get();
  if (!studentDoc.exists) return null;

  const student = StudentModel.fromFirestore(studentDoc);

  const reportsSnap = await studentsCollection.doc(id).collection('reports').get();
  const reports = reportsSnap.docs.map(ReportModel.fromFirestore);

  return { ...student, reports };
};

// ✅ Create Student (and assign to teacher)
exports.addStudent = async (studentData) => {
  const student = new StudentModel(studentData);
  const docRef = await studentsCollection.add(student.toFirestore());
  await docRef.update({ id: docRef.id });

  const newStudent = new StudentModel({ ...studentData, id: docRef.id });

  // 🟢 if assigned to a teacher → update teacher.students array
  if (studentData.teacherId) {
    const teacherRef = teachersCollection.doc(studentData.teacherId);
    await teacherRef.update({
      students: admin.firestore.FieldValue.arrayUnion(newStudent.id),
    });
    console.log(`👨‍🏫 Student ${newStudent.id} linked to teacher ${studentData.teacherId}`);
  }

  return newStudent;
};

// ✅ Add report to subcollection
exports.addReportToStudent = async (studentId, reportData) => {
  const report = new ReportModel(reportData);
  const reportsRef = studentsCollection.doc(studentId).collection('reports');
  const reportRef = await reportsRef.add(report.toFirestore());
  await reportRef.update({ id: reportRef.id });
  return new ReportModel({ ...reportData, id: reportRef.id });
};
