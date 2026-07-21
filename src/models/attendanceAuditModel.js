class AttendanceAuditModel {
  constructor({
    id = null,
    attendanceId,
    studentId,
    sessionId,
    oldStatus,
    newStatus,
    changedBy,
    reason = "",
    changedAt = null,
  }) {
    this.id = id;
    this.attendanceId = attendanceId;
    this.studentId = studentId;
    this.sessionId = sessionId;
    this.oldStatus = oldStatus;
    this.newStatus = newStatus;
    this.changedBy = changedBy;
    this.reason = reason;
    this.changedAt = changedAt || new Date().toISOString();
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new AttendanceAuditModel({
      id: doc.id,
      attendanceId: data.attendanceId,
      studentId: data.studentId,
      sessionId: data.sessionId,
      oldStatus: data.oldStatus,
      newStatus: data.newStatus,
      changedBy: data.changedBy,
      reason: data.reason || "",
      changedAt: data.changedAt || null,
    });
  }

  toFirestore() {
    return {
      attendanceId: this.attendanceId,
      studentId: this.studentId,
      sessionId: this.sessionId,
      oldStatus: this.oldStatus,
      newStatus: this.newStatus,
      changedBy: this.changedBy,
      reason: this.reason,
      changedAt: this.changedAt,
    };
  }
}

module.exports = AttendanceAuditModel;
