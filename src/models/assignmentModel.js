const { admin } = require("../config/firebase");

class AssignmentModel {
  constructor({
    id,
    suraList = [],
    suraRanges = [],
    sessionType,
    assignedDate,
    dueDate,
    notes = "",
    createdAt = null,
  }) {
    this.id = id;
    this.suraList = suraList;
    this.suraRanges = suraRanges;
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
    suraList: data.suraList || [],
    suraRanges: data.suraRanges || [],
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
    suraList: this.suraList.map((sura) => ({
      name: sura.name,
      startPage: sura.startPage,
      endPage: sura.endPage,
    })),
    suraRanges: this.suraRanges.map((range) => ({
      fromSura: range.fromSura,
      toSura: range.toSura,
      type: range.type || "full",
    })),

    sessionType: this.sessionType,
    assignedDate: this.assignedDate,
    dueDate: this.dueDate,
    notes: this.notes,

    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
};

module.exports = AssignmentModel;
