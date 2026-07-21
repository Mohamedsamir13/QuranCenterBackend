class ScheduleExceptionModel {
  constructor({
    id = null,
    studentId,
    groupId,
    date, // YYYY-MM-DD
    exceptionType, // "NOT_EXPECTED" | "EXTRA_SESSION"
    notes = "",
    createdBy = "",
    createdAt = null,
  }) {
    this.id = id;
    this.studentId = studentId;
    this.groupId = groupId;
    this.date = date;
    this.exceptionType = exceptionType;
    this.notes = notes;
    this.createdBy = createdBy;
    this.createdAt = createdAt || new Date().toISOString();
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new ScheduleExceptionModel({
      id: doc.id,
      studentId: data.studentId,
      groupId: data.groupId,
      date: data.date,
      exceptionType: data.exceptionType,
      notes: data.notes || "",
      createdBy: data.createdBy || "",
      createdAt: data.createdAt || null,
    });
  }

  toFirestore() {
    return {
      studentId: this.studentId,
      groupId: this.groupId,
      date: this.date,
      exceptionType: this.exceptionType,
      notes: this.notes,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}

module.exports = ScheduleExceptionModel;
