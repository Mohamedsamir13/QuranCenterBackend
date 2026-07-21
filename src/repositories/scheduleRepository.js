// repositories/scheduleRepository.js
const { db } = require("../config/firebase");
const StudentScheduleModel = require("../models/studentScheduleModel");
const ScheduleExceptionModel = require("../models/scheduleExceptionModel");

const schedulesCollection = db.collection("student_schedules");
const exceptionsCollection = db.collection("schedule_exceptions");
const studentsCollection = db.collection("students");

// 🗓️ Get all active schedules for a student
exports.getStudentSchedules = async (studentId) => {
  const snap = await schedulesCollection
    .where("studentId", "==", studentId)
    .where("isActive", "==", true)
    .get();
  return snap.docs.map((doc) => StudentScheduleModel.fromFirestore(doc));
};

// 🗓️ Set / Replace student schedules for a group
exports.setStudentSchedules = async (studentId, groupId, daysList) => {
  // Deactivate old schedules for this student & group
  const oldSnap = await schedulesCollection
    .where("studentId", "==", studentId)
    .where("groupId", "==", groupId)
    .get();

  const batch = db.batch();
  oldSnap.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  const createdSchedules = [];
  for (const item of daysList) {
    const dayOfWeek = typeof item === "string" ? item : item.dayOfWeek;
    const startTime = typeof item === "object" && item.startTime ? item.startTime : "10:00";
    const endTime = typeof item === "object" && item.endTime ? item.endTime : "11:00";

    const ref = schedulesCollection.doc();
    const model = new StudentScheduleModel({
      id: ref.id,
      studentId,
      groupId,
      dayOfWeek,
      startTime,
      endTime,
      isActive: true,
    });
    batch.set(ref, model.toFirestore());
    createdSchedules.push(model);
  }

  await batch.commit();
  return createdSchedules;
};

// 🗓️ Delete a specific schedule item
exports.deleteSchedule = async (scheduleId) => {
  await schedulesCollection.doc(scheduleId).delete();
  return true;
};

// 🗓️ Add date exception (NOT_EXPECTED | EXTRA_SESSION)
exports.addScheduleException = async (exceptionData) => {
  const ref = exceptionsCollection.doc();
  const model = new ScheduleExceptionModel({
    id: ref.id,
    ...exceptionData,
  });
  await ref.set(model.toFirestore());
  return model;
};

// 🗓️ Get date exceptions for student
exports.getStudentExceptions = async (studentId, date) => {
  let query = exceptionsCollection.where("studentId", "==", studentId);
  if (date) {
    query = query.where("date", "==", date);
  }
  const snap = await query.get();
  return snap.docs.map((doc) => ScheduleExceptionModel.fromFirestore(doc));
};

// 🗓️ Delete exception
exports.deleteException = async (exceptionId) => {
  await exceptionsCollection.doc(exceptionId).delete();
  return true;
};

// 🎯 Core Logic: Compute Expected Students for a Group Session
exports.getExpectedStudentsForSession = async (groupId, date, dayOfWeek) => {
  // 1. Fetch group document to get all enrolled students as fallback/reference
  const groupDoc = await db.collection("groups").doc(groupId).get();
  const groupData = groupDoc.exists ? groupDoc.data() : {};
  const groupStudentIds = groupData.students || [];

  // 2. Fetch recurring schedules for this group on dayOfWeek
  const scheduleSnap = await schedulesCollection
    .where("groupId", "==", groupId)
    .where("dayOfWeek", "==", dayOfWeek)
    .where("isActive", "==", true)
    .get();

  const scheduledStudentIds = new Set(
    scheduleSnap.docs.map((doc) => doc.data().studentId)
  );

  // Fallback: If no custom schedules are set for this group yet, default all enrolled group students as expected
  if (scheduledStudentIds.size === 0 && groupStudentIds.length > 0) {
    groupStudentIds.forEach((id) => scheduledStudentIds.add(id));
  }

  // 3. Fetch schedule exceptions for this group on date
  const exceptionsSnap = await exceptionsCollection
    .where("groupId", "==", groupId)
    .where("date", "==", date)
    .get();

  const exceptions = exceptionsSnap.docs.map((doc) =>
    ScheduleExceptionModel.fromFirestore(doc)
  );

  const finalExpectedIds = new Set(scheduledStudentIds);

  for (const exc of exceptions) {
    if (exc.exceptionType === "NOT_EXPECTED") {
      finalExpectedIds.delete(exc.studentId);
    } else if (exc.exceptionType === "EXTRA_SESSION") {
      finalExpectedIds.add(exc.studentId);
    }
  }

  // 4. Fetch full student documents for expected IDs
  const expectedStudents = [];
  for (const studentId of Array.from(finalExpectedIds)) {
    const sDoc = await studentsCollection.doc(studentId).get();
    if (sDoc.exists) {
      const data = sDoc.data();
      expectedStudents.push({
        id: sDoc.id,
        name: data.name || "Unknown",
        group: data.group || groupId,
        teacherId: data.teacherId || null,
        riwaya: data.riwaya || "",
      });
    }
  }

  return expectedStudents;
};
