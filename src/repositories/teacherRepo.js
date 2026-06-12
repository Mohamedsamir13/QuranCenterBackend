const firebase = require("../config/firebase");
const admin = firebase.admin;
const db = firebase.db;
const TeacherModel = require("../models/teachersModel");
const teachersCollection = db.collection("teachers");

exports.getAllTeachers = async () => {
  console.log("📡 [Repo] getAllTeachers() called");
  try {
    console.log("📁 Using collection:", teachersCollection.id);
    const snapshot = await teachersCollection.get();
    console.log("📄 Snapshot size:", snapshot.size);

    const teachers = snapshot.docs.map(TeacherModel.fromFirestore);

    // Fetch all student documents to count and associate them
    const studentsSnapshot = await db.collection("students").get();
    const studentsTeacherMap = {};
    studentsSnapshot.forEach((doc) => {
      const data = doc.data();
      const teacherId = data.teacherId;
      if (teacherId) {
        if (!studentsTeacherMap[teacherId]) {
          studentsTeacherMap[teacherId] = [];
        }
        studentsTeacherMap[teacherId].push(doc.id);
      }
    });

    return teachers.map((t) => {
      const computedIds = studentsTeacherMap[t.id] || [];
      const mergedIds = Array.from(new Set([...(t.students || []), ...computedIds]));
      t.students = mergedIds;
      return t;
    });
  } catch (error) {
    console.error(
      "🔥 Firestore error in getAllTeachers:",
      error.code,
      error.message,
      error.stack
    );
    throw error;
  }
};

exports.getTeacherById = async (id) => {
  const doc = await teachersCollection.doc(id).get();
  if (!doc.exists) return null;
  const teacher = TeacherModel.fromFirestore(doc);

  const studentsSnapshot = await db.collection("students").where("teacherId", "==", id).get();
  const computedIds = [];
  studentsSnapshot.forEach((doc) => {
    computedIds.push(doc.id);
  });

  const mergedIds = Array.from(new Set([...(teacher.students || []), ...computedIds]));
  teacher.students = mergedIds;
  return teacher;
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
exports.updateTeacher = async (id, updates) => {
  const teacherRef = teachersCollection.doc(id);
  await teacherRef.update(updates);
  const updatedDoc = await teacherRef.get();
  if (!updatedDoc.exists) return null;
  return TeacherModel.fromFirestore(updatedDoc);
};

// 🔴 Delete teacher
exports.deleteTeacher = async (id) => {
  const teacherRef = teachersCollection.doc(id);
  await teacherRef.delete();
  return true;
};
// 🟡 Update teacher (مثلاً تعديل الاسم)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await teacherService.update(id, updates);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ Error updating teacher:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update teacher" });
  }
};

// 🔴 Delete teacher
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await teacherService.remove(id);
    res
      .status(200)
      .json({ success: true, message: "Teacher deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting teacher:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete teacher" });
  }
};
