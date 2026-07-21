// repositories/attendanceRepository.js
const { db } = require("../config/firebase");
const GroupSessionModel = require("../models/sessionModel");
const AttendanceRecordModel = require("../models/attendanceModel");
const AttendanceAuditModel = require("../models/attendanceAuditModel");
const scheduleRepo = require("./scheduleRepository");

const sessionsCollection = db.collection("group_sessions");
const attendanceCollection = db.collection("attendance_records");
const auditCollection = db.collection("attendance_audit_logs");
const studentsCollection = db.collection("students");
const groupsCollection = db.collection("groups");

// 🕒 Helper: Helper to convert Day of week index (0-6) to string
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// 🎯 Get or Create Group Session
exports.getOrCreateSession = async ({ groupId, date, startTime = "10:00", endTime = "11:00", teacherId = null, studentIds = [], students = [] }) => {
  let query = sessionsCollection.where("groupId", "==", groupId).where("date", "==", date);
  const snap = await query.get();

  if (!snap.empty) {
    const existingSession = GroupSessionModel.fromFirestore(snap.docs[0]);
    const updateData = {};
    if (students.length > 0) updateData.storedStudents = students;
    if (studentIds.length > 0) updateData.storedStudentIds = studentIds;
    if (Object.keys(updateData).length > 0) {
      await sessionsCollection.doc(existingSession.id).update(updateData);
    }
    return existingSession;
  }

  // Get teacherId from group if not provided
  if (!teacherId) {
    const groupDoc = await groupsCollection.doc(groupId).get();
    if (groupDoc.exists) {
      teacherId = groupDoc.data().teacherId || null;
    }
  }

  const ref = sessionsCollection.doc();
  const session = new GroupSessionModel({
    id: ref.id,
    groupId,
    date,
    startTime,
    endTime,
    teacherId,
    status: "ATTENDANCE_OPEN",
  });

  const sessionData = session.toFirestore();
  if (students.length > 0) sessionData.storedStudents = students;
  if (studentIds.length > 0) sessionData.storedStudentIds = studentIds;

  await ref.set(sessionData);
  return session;
};

// 🎯 Update Session Status
exports.updateSessionStatus = async (sessionId, status) => {
  await sessionsCollection.doc(sessionId).update({
    status,
    updatedAt: new Date().toISOString(),
  });
  return true;
};

// 🎯 Get Today's Sessions for Teacher or All
exports.getTodaySessions = async (teacherId = null, date = null) => {
  const targetDate = date || new Date().toISOString().split("T")[0];
  let query = sessionsCollection.where("date", "==", targetDate);
  if (teacherId) {
    query = query.where("teacherId", "==", teacherId);
  }
  const snap = await query.get();
  return snap.docs.map((doc) => GroupSessionModel.fromFirestore(doc));
};

// 🎯 Get Attendance for a Session (Always shows ALL group students)
exports.getSessionAttendanceDetails = async (sessionId) => {
  const sessionDoc = await sessionsCollection.doc(sessionId).get();
  if (!sessionDoc.exists) return null;

  const session = GroupSessionModel.fromFirestore(sessionDoc);

  // Get date day name (e.g. "Monday")
  const dateObj = new Date(session.date);
  const dayOfWeek = DAY_NAMES[dateObj.getDay()];

  // ✅ STEP 1: Get student details (storedStudents or storedStudentIds, fallback to group doc)
  const sessionRaw = sessionDoc.data();
  let storedStudents = sessionRaw.storedStudents || [];
  let groupStudentIds = sessionRaw.storedStudentIds || [];

  if (storedStudents.length === 0 && groupStudentIds.length === 0) {
    // Fallback: fetch from group document
    const groupDoc = await groupsCollection.doc(session.groupId).get();
    const groupData = groupDoc.exists ? groupDoc.data() : {};
    groupStudentIds = groupData.students || [];
  }

  // ✅ STEP 2: Resolve group students list
  let groupStudents = [];
  if (storedStudents.length > 0) {
    groupStudents = storedStudents;
  } else {
    const studentDocs = await Promise.all(
      groupStudentIds.map((id) => studentsCollection.doc(id).get())
    );
    groupStudents = studentDocs.map((d, index) => {
      const id = groupStudentIds[index];
      let name = (d && d.exists && d.data().name) ? d.data().name : id;
      return { id, name };
    });
  }

  // ✅ STEP 3: Fetch existing attendance records for this session
  const attSnap = await attendanceCollection.where("sessionId", "==", sessionId).get();
  const existingRecords = attSnap.docs.map((doc) => AttendanceRecordModel.fromFirestore(doc));

  const recordsMap = new Map();
  existingRecords.forEach((r) => recordsMap.set(r.studentId, r));

  // ✅ STEP 4: Merge — for each group student, default status to "PRESENT" for open sessions
  const studentAttendanceList = [];
  const seenStudentIds = new Set();
  const seenStudentNames = new Set();

  for (const s of groupStudents) {
    if (seenStudentIds.has(s.id) || (s.name && seenStudentNames.has(s.name))) continue;
    seenStudentIds.add(s.id);
    if (s.name) seenStudentNames.add(s.name);

    const record = recordsMap.get(s.id);
    studentAttendanceList.push({
      studentId: s.id,
      studentName: s.name,
      eligibilityType: (record && record.eligibilityType === "EXTRA") ? "EXTRA" : "EXPECTED",
      status: record ? record.status : "PRESENT", // ✅ Default to PRESENT as requested
      attendanceId: record ? record.id : null,
      scheduledStartAt: record ? record.scheduledStartAt : session.startTime,
      actualArrivalAt: record ? record.actualArrivalAt : null,
      lateMinutes: record ? record.lateMinutes : 0,
      absenceReason: record ? record.absenceReason : "",
      notes: record ? record.notes : "",
    });
  }

  // ✅ STEP 5: Include truly extra students (added manually, NOT in group roster)
  for (const r of existingRecords) {
    if (!seenStudentIds.has(r.studentId)) {
      seenStudentIds.add(r.studentId);
      const sDoc = await studentsCollection.doc(r.studentId).get();
      const sName = sDoc.exists ? sDoc.data().name : "Extra Student";
      studentAttendanceList.push({
        studentId: r.studentId,
        studentName: sName,
        eligibilityType: "EXTRA",
        status: r.status,
        attendanceId: r.id,
        scheduledStartAt: r.scheduledStartAt,
        actualArrivalAt: r.actualArrivalAt,
        lateMinutes: r.lateMinutes,
        absenceReason: r.absenceReason,
        notes: r.notes,
      });
    }
  }

  return {
    session,
    dayOfWeek,
    totalExpected: groupStudents.length,
    totalRecorded: existingRecords.length,
    attendance: studentAttendanceList,
  };
};


// 🎯 Record / Save Session Attendance in Bulk
exports.saveSessionAttendance = async (sessionId, recordsList, markedBy = "Teacher") => {
  const sessionDoc = await sessionsCollection.doc(sessionId).get();
  if (!sessionDoc.exists) throw new Error("Session not found");
  const session = GroupSessionModel.fromFirestore(sessionDoc);

  const batch = db.batch();
  const now = new Date().toISOString();

  for (const item of recordsList) {
    const {
      studentId,
      eligibilityType = "EXPECTED",
      status = "PRESENT",
      actualArrivalAt = null,
      absenceReason = "",
      notes = "",
    } = item;

    // Calculate late minutes if status is LATE
    let lateMinutes = 0;
    if (status === "LATE" && actualArrivalAt && session.startTime) {
      const [schedH, schedM] = session.startTime.split(":").map(Number);
      const [actH, actM] = actualArrivalAt.split(":").map(Number);
      const schedTotal = schedH * 60 + schedM;
      const actTotal = actH * 60 + actM;
      if (actTotal > schedTotal) {
        lateMinutes = actTotal - schedTotal;
      }
    }

    // Check if record already exists
    const existingSnap = await attendanceCollection
      .where("sessionId", "==", sessionId)
      .where("studentId", "==", studentId)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      const docRef = existingSnap.docs[0].ref;
      const oldModel = AttendanceRecordModel.fromFirestore(existingSnap.docs[0]);

      if (oldModel.status !== status) {
        // Audit log for change
        const auditRef = auditCollection.doc();
        batch.set(
          auditRef,
          new AttendanceAuditModel({
            id: auditRef.id,
            attendanceId: docRef.id,
            studentId,
            sessionId,
            oldStatus: oldModel.status,
            newStatus: status,
            changedBy: markedBy,
            reason: "Bulk update",
            changedAt: now,
          }).toFirestore()
        );
      }

      batch.update(docRef, {
        status,
        actualArrivalAt,
        lateMinutes,
        absenceReason,
        notes,
        updatedBy: markedBy,
        updatedAt: now,
      });
    } else {
      const docRef = attendanceCollection.doc();
      const model = new AttendanceRecordModel({
        id: docRef.id,
        sessionId,
        studentId,
        eligibilityType,
        status,
        scheduledStartAt: session.startTime,
        actualArrivalAt,
        lateMinutes,
        absenceReason,
        notes,
        markedBy,
        markedAt: now,
      });
      batch.set(docRef, model.toFirestore());
    }
  }

  // Update session status to COMPLETED
  batch.update(sessionsCollection.doc(sessionId), {
    status: "COMPLETED",
    updatedAt: now,
  });

  await batch.commit();
  return true;
};

// 🎯 Add Extra Student to Session
exports.addExtraStudent = async (sessionId, studentId, status = "PRESENT", markedBy = "Teacher") => {
  const sessionDoc = await sessionsCollection.doc(sessionId).get();
  if (!sessionDoc.exists) throw new Error("Session not found");
  const session = GroupSessionModel.fromFirestore(sessionDoc);

  // Check if student already has attendance in this session
  const existingSnap = await attendanceCollection
    .where("sessionId", "==", sessionId)
    .where("studentId", "==", studentId)
    .limit(1)
    .get();

  if (!existingSnap.empty) {
    return AttendanceRecordModel.fromFirestore(existingSnap.docs[0]);
  }

  const docRef = attendanceCollection.doc();
  const model = new AttendanceRecordModel({
    id: docRef.id,
    sessionId,
    studentId,
    eligibilityType: "EXTRA",
    status,
    scheduledStartAt: session.startTime,
    markedBy,
  });

  await docRef.set(model.toFirestore());
  return model;
};

// 🎯 Get Student Attendance Summary & History
exports.getStudentAttendanceSummary = async (studentId) => {
  const snap = await attendanceCollection.where("studentId", "==", studentId).get();
  const records = snap.docs.map((doc) => AttendanceRecordModel.fromFirestore(doc));

  let present = 0;
  let late = 0;
  let absent = 0;
  let excused = 0;
  let extra = 0;

  const history = [];

  for (const r of records) {
    if (r.eligibilityType === "EXTRA") extra++;

    if (r.status === "PRESENT") present++;
    else if (r.status === "LATE") late++;
    else if (r.status === "ABSENT") absent++;
    else if (r.status === "EXCUSED") excused++;

    // Fetch session date info
    let dateStr = r.markedAt ? r.markedAt.split("T")[0] : "";
    if (r.sessionId) {
      const sDoc = await sessionsCollection.doc(r.sessionId).get();
      if (sDoc.exists) dateStr = sDoc.data().date;
    }

    history.push({
      attendanceId: r.id,
      sessionId: r.sessionId,
      date: dateStr,
      eligibilityType: r.eligibilityType,
      status: r.status,
      lateMinutes: r.lateMinutes,
      absenceReason: r.absenceReason,
      notes: r.notes,
    });
  }

  // Sort history newest first
  history.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalExpected = present + late + absent + excused;
  const attendanceRate = totalExpected > 0 ? ((present + late) / totalExpected) * 100 : 100.0;
  const punctualityRate = present + late > 0 ? (present / (present + late)) * 100 : 100.0;

  return {
    studentId,
    expectedSessions: totalExpected,
    presentCount: present,
    lateCount: late,
    absentCount: absent,
    excusedCount: excused,
    extraCount: extra,
    attendanceRate: Number(attendanceRate.toFixed(1)),
    punctualityRate: Number(punctualityRate.toFixed(1)),
    history,
  };
};

// 🎯 Manager Analytics & At-Risk Students
exports.getAcademyAttendanceAnalytics = async (dateRange = "this_month") => {
  const snap = await attendanceCollection.get();
  const records = snap.docs.map((doc) => AttendanceRecordModel.fromFirestore(doc));

  let totalExpected = 0;
  let present = 0;
  let late = 0;
  let absent = 0;
  let excused = 0;

  const studentStatsMap = new Map();

  for (const r of records) {
    if (r.eligibilityType === "EXPECTED") totalExpected++;
    if (r.status === "PRESENT") present++;
    else if (r.status === "LATE") late++;
    else if (r.status === "ABSENT") absent++;
    else if (r.status === "EXCUSED") excused++;

    if (!studentStatsMap.has(r.studentId)) {
      studentStatsMap.set(r.studentId, { present: 0, late: 0, absent: 0, excused: 0, expected: 0 });
    }
    const stat = studentStatsMap.get(r.studentId);
    if (r.eligibilityType === "EXPECTED") stat.expected++;
    if (r.status === "PRESENT") stat.present++;
    if (r.status === "LATE") stat.late++;
    if (r.status === "ABSENT") stat.absent++;
    if (r.status === "EXCUSED") stat.excused++;
  }

  const overallRate = totalExpected > 0 ? Math.min(100.0, ((present + late) / Math.max(totalExpected, present + late + absent + excused)) * 100) : 100.0;
  const overallPunctuality = present + late > 0 ? Math.min(100.0, (present / (present + late)) * 100) : 100.0;

  // Identify At-Risk Students (< 75% attendance or 3+ absences)
  const atRiskStudents = [];
  for (const [studentId, stat] of studentStatsMap.entries()) {
    const totalSess = Math.max(stat.expected, stat.present + stat.late + stat.absent + stat.excused);
    const rate = totalSess > 0 ? Math.min(100.0, ((stat.present + stat.late) / totalSess) * 100) : 100;
    if (rate < 75 || stat.absent >= 3) {
      const sDoc = await studentsCollection.doc(studentId).get();
      const sData = sDoc.exists ? sDoc.data() : {};
      atRiskStudents.push({
        studentId,
        studentName: sData.name || studentId,
        group: sData.group || "N/A",
        attendanceRate: Number(rate.toFixed(1)),
        absentCount: stat.absent,
        lateCount: stat.late,
        riskLevel: rate < 60 || stat.absent >= 5 ? "HIGH" : "MEDIUM",
      });
    }
  }

  return {
    totalExpectedSessions: totalExpected,
    presentCount: present,
    lateCount: late,
    absentCount: absent,
    excusedCount: excused,
    overallAttendanceRate: Number(overallRate.toFixed(1)),
    overallPunctualityRate: Number(overallPunctuality.toFixed(1)),
    atRiskStudents,
  };
};

// 🎯 Attendance Audit Logs
exports.getAuditLogs = async (sessionId = null, studentId = null) => {
  let query = auditCollection.orderBy("changedAt", "desc");
  if (sessionId) query = query.where("sessionId", "==", sessionId);
  if (studentId) query = query.where("studentId", "==", studentId);

  const snap = await query.get();
  return snap.docs.map((doc) => AttendanceAuditModel.fromFirestore(doc));
};

// 🎯 Get Today's Absences (Manager Dashboard - Fast)
exports.getTodayAbsences = async (targetDate = null) => {
  const dateStr = targetDate || new Date().toISOString().split("T")[0];

  // Get all sessions for target date
  const sessionsSnap = await sessionsCollection.where("date", "==", dateStr).get();
  if (sessionsSnap.empty) return [];

  const absences = [];

  for (const sessionDoc of sessionsSnap.docs) {
    const session = GroupSessionModel.fromFirestore(sessionDoc);

    // Get group info
    const groupDoc = await groupsCollection.doc(session.groupId).get();
    const groupData = groupDoc.exists ? groupDoc.data() : {};
    const groupName = groupData.name || "Unknown Group";

    // Get attendance records for this session
    const attSnap = await attendanceCollection
      .where("sessionId", "==", session.id)
      .where("status", "==", "ABSENT")
      .get();

    for (const attDoc of attSnap.docs) {
      const att = AttendanceRecordModel.fromFirestore(attDoc);
      if (att.eligibilityType !== "EXPECTED") continue;

      // Fetch student info
      const sDoc = await studentsCollection.doc(att.studentId).get();
      const sData = sDoc.exists ? sDoc.data() : {};

      // Get student's full history stats
      const historySnap = await attendanceCollection
        .where("studentId", "==", att.studentId)
        .where("eligibilityType", "==", "EXPECTED")
        .get();

      let totalPresent = 0, totalLate = 0, totalAbsent = 0, totalExcused = 0;
      historySnap.docs.forEach((d) => {
        const r = d.data();
        if (r.status === "PRESENT") totalPresent++;
        else if (r.status === "LATE") totalLate++;
        else if (r.status === "ABSENT") totalAbsent++;
        else if (r.status === "EXCUSED") totalExcused++;
      });
      const totalExpected = totalPresent + totalLate + totalAbsent + totalExcused;
      const attendanceRate = totalExpected > 0 ? Math.min(100.0, ((totalPresent + totalLate) / totalExpected) * 100) : 100;

      absences.push({
        studentId: att.studentId,
        studentName: sData.name || att.studentId,
        riwaya: sData.reports?.[0]?.riwaya || sData.riwaya || "N/A",
        level: sData.level || "N/A",
        groupId: session.groupId,
        groupName,
        sessionDate: dateStr,
        absenceReason: att.absenceReason || "",
        totalPresent,
        totalLate,
        totalAbsent,
        totalExcused,
        totalSessions: totalExpected,
        attendanceRate: Number(attendanceRate.toFixed(1)),
      });
    }
  }

  return absences;
};

// 🎯 Get Today's KPI Stats (fast summary)
exports.getTodayStats = async (targetDate = null) => {
  const dateStr = targetDate || new Date().toISOString().split("T")[0];
  const sessionsSnap = await sessionsCollection.where("date", "==", dateStr).get();

  if (sessionsSnap.empty) {
    return { totalSessions: 0, totalExpected: 0, present: 0, late: 0, absent: 0, excused: 0, notRecorded: 0 };
  }

  const sessionIds = sessionsSnap.docs.map((d) => d.id);
  let present = 0, late = 0, absent = 0, excused = 0, notRecorded = 0, totalExpected = 0;

  // Firestore 'in' query supports max 30 items at a time
  const chunks = [];
  for (let i = 0; i < sessionIds.length; i += 30) {
    chunks.push(sessionIds.slice(i, i + 30));
  }

  for (const chunk of chunks) {
    const attSnap = await attendanceCollection.where("sessionId", "in", chunk).get();
    attSnap.docs.forEach((doc) => {
      const r = doc.data();
      if (r.eligibilityType !== "EXPECTED") return;
      totalExpected++;
      if (r.status === "PRESENT") present++;
      else if (r.status === "LATE") late++;
      else if (r.status === "ABSENT") absent++;
      else if (r.status === "EXCUSED") excused++;
      else notRecorded++;
    });
  }

  return {
    totalSessions: sessionsSnap.size,
    totalExpected,
    present,
    late,
    absent,
    excused,
    notRecorded,
  };
};

// 🎯 Get Group Attendance Stats (per group breakdown)
exports.getGroupAttendanceStats = async (groupId) => {
  const sessionsSnap = await sessionsCollection.where("groupId", "==", groupId).get();
  if (sessionsSnap.empty) return { groupId, totalSessions: 0, studentStats: [] };

  const sessionIds = sessionsSnap.docs.map((d) => d.id);
  const studentStatsMap = new Map();

  const chunks = [];
  for (let i = 0; i < sessionIds.length; i += 30) {
    chunks.push(sessionIds.slice(i, i + 30));
  }

  for (const chunk of chunks) {
    const attSnap = await attendanceCollection.where("sessionId", "in", chunk).get();
    attSnap.docs.forEach((doc) => {
      const r = doc.data();
      if (!studentStatsMap.has(r.studentId)) {
        studentStatsMap.set(r.studentId, { present: 0, late: 0, absent: 0, excused: 0, expected: 0 });
      }
      const stat = studentStatsMap.get(r.studentId);
      if (r.eligibilityType === "EXPECTED") stat.expected++;
      if (r.status === "PRESENT") stat.present++;
      else if (r.status === "LATE") stat.late++;
      else if (r.status === "ABSENT") stat.absent++;
      else if (r.status === "EXCUSED") stat.excused++;
    });
  }

  const studentStats = [];
  for (const [studentId, stat] of studentStatsMap.entries()) {
    const sDoc = await studentsCollection.doc(studentId).get();
    const sData = sDoc.exists ? sDoc.data() : {};
    const totalSess = Math.max(stat.expected, stat.present + stat.late + stat.absent + stat.excused);
    const rate = totalSess > 0 ? Math.min(100.0, ((stat.present + stat.late) / totalSess) * 100) : 100;
    studentStats.push({
      studentId,
      studentName: sData.name || studentId,
      riwaya: sData.reports?.[0]?.riwaya || sData.riwaya || "N/A",
      ...stat,
      attendanceRate: Number(rate.toFixed(1)),
    });
  }

  studentStats.sort((a, b) => a.attendanceRate - b.attendanceRate);

  return {
    groupId,
    totalSessions: sessionsSnap.size,
    studentStats,
  };
};

