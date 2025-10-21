const firebase = require('../config/firebase');
const admin = firebase.admin;
const db = firebase.db;
const TeacherModel = require('../models/teachersModel');
const teachersCollection = db.collection('teachers');

exports.getAllTeachers = async () => {
  console.log('📡 [Repo] getAllTeachers() called');
  try {
    console.log('📁 Using collection:', teachersCollection.id);
    const snapshot = await teachersCollection.get();
    console.log('📄 Snapshot size:', snapshot.size);

    // Debug each doc
    snapshot.forEach(doc => {
      console.log('👤 Teacher doc found:', doc.id, doc.data());
    });

    return snapshot.docs.map(TeacherModel.fromFirestore);
  } catch (error) {
    console.error('🔥 Firestore error in getAllTeachers:', error.code, error.message, error.stack);
    throw error;
  }
};


exports.getTeacherById = async (id) => {
  const doc = await teachersCollection.doc(id).get();
  if (!doc.exists) return null;
  return TeacherModel.fromFirestore(doc);
};

exports.addTeacher = async (teacherData) => {
  const teacher = new TeacherModel(teacherData);
  const docRef = await teachersCollection.add(teacher.toFirestore());
  await docRef.update({ id: docRef.id });
  return new TeacherModel({ ...teacherData, id: docRef.id });
};

exports.addStudentToTeacher = async (teacherId, studentId) => {
  const teacherRef = teachersCollection.doc(teacherId);
  await teacherRef.update({
    students: admin.firestore.FieldValue.arrayUnion(studentId),
  });
  return true;
};
