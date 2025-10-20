const { db, admin } = require('../config/firebase');
const TeacherModel = require('../models/teachersModel');

const teachersCollection = db.collection('teachers');

exports.addStudentToTeacher = async (teacherId, studentId) => {
  console.log('🟦 Repo: Adding student', studentId, 'to teacher', teacherId);

  try {
    // 🔍 Step 1: تأكد أن teacherId مش فاضي
    if (!teacherId || !studentId) {
      console.error('⚠️ Missing IDs:', { teacherId, studentId });
      throw new Error('teacherId and studentId are required');
    }

    // 🔍 Step 2: تحقق أن المدرس موجود
    const teacherDoc = await teachersCollection.doc(teacherId).get();
    if (!teacherDoc.exists) {
      console.error('❌ No teacher found with ID:', teacherId);
      throw new Error(`Teacher not found: ${teacherId}`);
    }

    console.log('📘 Current teacher data:', teacherDoc.data());

    // 🔍 Step 3: أضف الطالب
    await teachersCollection.doc(teacherId).update({
      students: admin.firestore.FieldValue.arrayUnion(studentId),
    });

    console.log('✅ Repo: Student added successfully');
    return true;
  } catch (error) {
    console.error('🔥 FULL FIREBASE ERROR STACK 🔥');
    console.error(error.stack || error);
    throw error;
  }
};
