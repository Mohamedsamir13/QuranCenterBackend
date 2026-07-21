class AttendanceRecordModel {
  constructor({
    id = null,
    sessionId,
    studentId,
    eligibilityType = "EXPECTED", // "EXPECTED" | "EXTRA"
    status = "PRESENT", // "PRESENT" | "LATE" | "ABSENT" | "EXCUSED"
    scheduledStartAt = null,
    actualArrivalAt = null,
    lateMinutes = 0,
    absenceReason = "",
    notes = "",
    markedBy = "",
    markedAt = null,
    updatedBy = "",
    updatedAt = null,
  }) {
    this.id = id;
    this.sessionId = sessionId;
    this.studentId = studentId;
    this.eligibilityType = eligibilityType;
    this.status = status;
    this.scheduledStartAt = scheduledStartAt;
    this.actualArrivalAt = actualArrivalAt;
    this.lateMinutes = lateMinutes;
    this.absenceReason = absenceReason;
    this.notes = notes;
    this.markedBy = markedBy;
    this.markedAt = markedAt || new Date().toISOString();
    this.updatedBy = updatedBy;
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new AttendanceRecordModel({
      id: doc.id,
      sessionId: data.sessionId,
      studentId: data.studentId,
      eligibilityType: data.eligibilityType || "EXPECTED",
      status: data.status || "PRESENT",
      scheduledStartAt: data.scheduledStartAt || null,
      actualArrivalAt: data.actualArrivalAt || null,
      lateMinutes: data.lateMinutes || 0,
      absenceReason: data.absenceReason || "",
      notes: data.notes || "",
      markedBy: data.markedBy || "",
      markedAt: data.markedAt || null,
      updatedBy: data.updatedBy || "",
      updatedAt: data.updatedAt || null,
    });
  }

  toFirestore() {
    return {
      sessionId: this.sessionId,
      studentId: this.studentId,
      eligibilityType: this.eligibilityType,
      status: this.status,
      scheduledStartAt: this.scheduledStartAt,
      actualArrivalAt: this.actualArrivalAt,
      lateMinutes: this.lateMinutes,
      absenceReason: this.absenceReason,
      notes: this.notes,
      markedBy: this.markedBy,
      markedAt: this.markedAt,
      updatedBy: this.updatedBy,
      updatedAt: new Date().toISOString(),
    };
  }
}

module.exports = AttendanceRecordModel;
