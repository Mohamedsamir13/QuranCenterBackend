// src/repositories/studentRepository.js
const { db } = require('../config/firebase');

const studentsCollection = db.collection('students');

exports.getAllStudents = async () => {
  const snapshot = await studentsCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.addStudent = async (studentData) => {
  const docRef = await db.collection('students').add(studentData);

  // خزّن الـ id جوه نفس الـ document
  await docRef.update({ id: docRef.id });

  return { id: docRef.id, ...studentData };
};


exports.getStudentById = async (id) => {
  const doc = await studentsCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

exports.addReportToStudent = async (id, report) => {
  const studentRef = studentsCollection.doc(id);
  await studentRef.update({
    reports: admin.firestore.FieldValue.arrayUnion(report)
  });
};
