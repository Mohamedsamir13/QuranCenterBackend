// models/assignmentModel.js
const { admin } = require("../config/firebase"); // 👈 تأكد من المسار الصحيح
class AssignmentModel {
  constructor({
    id,
    sura,
    startPage,
    endPage,
    sessionType,
    assignedDate,
    dueDate,
    notes = "",
    createdAt = null, // 👈 NEW
  }) {
    this.id = id;
    this.sura = sura;
    this.startPage = startPage;
    this.endPage = endPage;
    this.sessionType = sessionType;
    this.assignedDate = assignedDate;
    this.dueDate = dueDate;
    this.notes = notes;
    this.createdAt = createdAt;
  }
}

AssignmentModel.fromFirestore = (doc) => {
  const data = doc.data();
  return new AssignmentModel({
    id: doc.id,
    sura: data.sura,
    startPage: data.startPage,
    endPage: data.endPage,
    sessionType: data.sessionType,
    assignedDate: data.assignedDate?.toDate
      ? data.assignedDate.toDate()
      : new Date(data.assignedDate),
    dueDate: data.dueDate?.toDate
      ? data.dueDate.toDate()
      : data.dueDate
        ? new Date(data.dueDate)
        : null,
    notes: data.notes || "",
    createdAt: data.createdAt?.toDate?.() ?? null,
  });
};

AssignmentModel.prototype.toFirestore = function () {
  return {
    sura: this.sura,
    startPage: this.startPage,
    endPage: this.endPage,
    sessionType: this.sessionType,
    assignedDate: this.assignedDate,
    dueDate: this.dueDate,
    notes: this.notes,
    createdAt: admin.firestore.FieldValue.serverTimestamp(), // 👈 أهم سطر
  };
};

module.exports = AssignmentModel;
