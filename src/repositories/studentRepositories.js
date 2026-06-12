// repositories/studentRepositories.js
const { db, admin } = require("../config/firebase");
const StudentModel = require("../models/studentModel");
const ReportModel = require("../models/reportModel");
const AssignmentModel = require("../models/assignmentModel");
const studentsCollection = db.collection("students");
const teachersCollection = db.collection("teachers");

// ✅ Get all students
exports.getAllStudents = async () => {
  const snapshot = await studentsCollection.get();
  return snapshot.docs.map((doc) => StudentModel.fromFirestore(doc));
};

// ✅ Get student by ID (with reports)
exports.getStudentById = async (id) => {
  const doc = await studentsCollection.doc(id).get();
  if (!doc.exists) return null;

  const student = StudentModel.fromFirestore(doc);
  const reportsSnap = await studentsCollection
    .doc(id)
    .collection("reports")
    .orderBy("createdAt", "desc") // 👈 الترتيب الحقيقي

    .get();
  const reports = reportsSnap.docs.map((doc) => ReportModel.fromFirestore(doc));

  return { ...student, reports };
};

// ✅ Create student
exports.addStudent = async (data) => {
  const student = new StudentModel(data);
  const docRef = await studentsCollection.add(student.toFirestore());
  await docRef.update({ id: docRef.id });

  // Assign to teacher if needed
  if (data.teacherId) {
    await teachersCollection.doc(data.teacherId).update({
      students: admin.firestore.FieldValue.arrayUnion(docRef.id),
    });
  }

  return { ...data, id: docRef.id };
};

// ✅ Update student
exports.updateStudent = async (id, data) => {
  const docRef = studentsCollection.doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  await docRef.update(data);
  return { id, ...data };
};

// ✅ Delete student
exports.deleteStudent = async (id) => {
  const docRef = studentsCollection.doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  // Remove student from teacher's students array
  const student = doc.data();
  if (student.teacherId) {
    await teachersCollection.doc(student.teacherId).update({
      students: admin.firestore.FieldValue.arrayRemove(id),
    });
  }

  // Delete reports subcollection
  const reportsSnap = await docRef.collection("reports").get();
  const batch = db.batch();
  reportsSnap.forEach((r) => batch.delete(r.ref));
  await batch.commit();

  // Delete student itself
  await docRef.delete();
  return true;
};

// ✅ Add report
exports.addReportToStudent = async (studentId, reportData) => {
  console.log("🔥 FINAL REPORT DATA =>", reportData);

  const report = new ReportModel(reportData);
  const reportsRef = studentsCollection.doc(studentId).collection("reports");
  const reportRef = await reportsRef.add(report.toFirestore());
  await reportRef.update({ id: reportRef.id });

  return { ...reportData, id: reportRef.id };
};

// ✅ Get reports for student
exports.getReportsForStudent = async (studentId) => {
  const snap = await studentsCollection
    .doc(studentId)
    .collection("reports")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map(ReportModel.fromFirestore);
};

// ✅ Get report by ID
exports.getReportById = async (studentId, reportId) => {
  const doc = await studentsCollection
    .doc(studentId)
    .collection("reports")
    .doc(reportId)
    .get();
  if (!doc.exists) return null;
  return ReportModel.fromFirestore(doc);
};

// ✅ Update report
exports.updateReport = async (studentId, reportId, data) => {
  const ref = studentsCollection
    .doc(studentId)
    .collection("reports")
    .doc(reportId);
  const doc = await ref.get();
  if (!doc.exists) return null;

  await ref.update(data);
  return { id: reportId, ...data };
};

// ✅ Delete report
exports.deleteReport = async (studentId, reportId) => {
  const ref = studentsCollection
    .doc(studentId)
    .collection("reports")
    .doc(reportId);
  const doc = await ref.get();
  if (!doc.exists) return false;

  await ref.delete();
  return true;
};


// Add Assignment
exports.addAssignmentToStudent = async (studentId, assignmentData) => {
  const assignment = new AssignmentModel(assignmentData);
  const assignmentsRef = studentsCollection
    .doc(studentId)
    .collection("assignments");
  const assignmentRef = await assignmentsRef.add(assignment.toFirestore());
  await assignmentRef.update({ id: assignmentRef.id });
  return { ...assignmentData, id: assignmentRef.id };
};

// Get Assignments
exports.getAssignmentsForStudent = async (studentId) => {
  const snap = await studentsCollection
    .doc(studentId)
    .collection("assignments")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map(AssignmentModel.fromFirestore);
};

// Delete Assignment
exports.deleteAssignment = async (studentId, assignmentId) => {
  const ref = studentsCollection
    .doc(studentId)
    .collection("assignments")
    .doc(assignmentId);
  await ref.delete();
  return true;
};

// Update Assignment
exports.updateAssignment = async (studentId, assignmentId, data) => {
  const ref = studentsCollection
    .doc(studentId)
    .collection("assignments")
    .doc(assignmentId);
  await ref.update(data);
  return { id: assignmentId, ...data };
};
