const { db } = require('../config/firebase');
const TeacherModel = require('../models/teachersModel');

const teachersCollection = db.collection('teachers');

exports.getAllTeachers = async () => {
  const snapshot = await teachersCollection.get();
  return snapshot.docs.map(TeacherModel.fromFirestore);
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
  console.log('🟦 Repo: Adding student', studentId, 'to teacher', teacherId);

  try {
    const teacherRef = teachersCollection.doc(teacherId);
    await teacherRef.update({
      students: admin.firestore.FieldValue.arrayUnion(studentId),
    });
    console.log('✅ Repo: Student added successfully');
    return true;
  } catch (error) {
    console.error('🔥 Repo ERROR:', error);
    throw error;
  }
};

