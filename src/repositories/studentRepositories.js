const StudentModel = require('../models/studentModel');
const { db } = require('../config/firebase');
const studentsCollection = db.collection('students');

exports.getAllStudents = async () => {
  const snapshot = await studentsCollection.get();
  return snapshot.docs.map(StudentModel.fromFirestore);
};

exports.addStudent = async (studentData) => {
  const student = new StudentModel(studentData);
  const docRef = await studentsCollection.add(student.toFirestore());
  await docRef.update({ id: docRef.id });
  return new StudentModel({ ...studentData, id: docRef.id });
};
