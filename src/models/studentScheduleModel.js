class StudentScheduleModel {
  constructor({
    id = null,
    studentId,
    groupId,
    dayOfWeek,
    startTime = "10:00",
    endTime = "11:00",
    isActive = true,
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.studentId = studentId;
    this.groupId = groupId;
    this.dayOfWeek = dayOfWeek; // e.g. "Saturday", "Tuesday"
    this.startTime = startTime;
    this.endTime = endTime;
    this.isActive = isActive;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new StudentScheduleModel({
      id: doc.id,
      studentId: data.studentId,
      groupId: data.groupId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime || "10:00",
      endTime: data.endTime || "11:00",
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
    });
  }

  toFirestore() {
    return {
      studentId: this.studentId,
      groupId: this.groupId,
      dayOfWeek: this.dayOfWeek,
      startTime: this.startTime,
      endTime: this.endTime,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString(),
    };
  }
}

module.exports = StudentScheduleModel;
