class GroupSessionModel {
  constructor({
    id = null,
    groupId,
    date, // YYYY-MM-DD
    startTime = "10:00",
    endTime = "11:00",
    teacherId = null,
    status = "SCHEDULED", // "SCHEDULED" | "IN_PROGRESS" | "ATTENDANCE_OPEN" | "COMPLETED" | "CANCELLED"
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.groupId = groupId;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.teacherId = teacherId;
    this.status = status;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new GroupSessionModel({
      id: doc.id,
      groupId: data.groupId,
      date: data.date,
      startTime: data.startTime || "10:00",
      endTime: data.endTime || "11:00",
      teacherId: data.teacherId || null,
      status: data.status || "SCHEDULED",
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
    });
  }

  toFirestore() {
    return {
      groupId: this.groupId,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      teacherId: this.teacherId || null,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString(),
    };
  }
}

module.exports = GroupSessionModel;
