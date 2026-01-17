// models/assignmentModel.js
class AssignmentModel {
  constructor({
    id,
    sura,
    startPage,
    endPage,
    assignedDate,
    dueDate,
    notes = "",
  }) {
    this.id = id;
    this.sura = sura;
    this.startPage = startPage;
    this.endPage = endPage;
    this.assignedDate = assignedDate;
    this.dueDate = dueDate;
    this.notes = notes;
  }
}

AssignmentModel.fromFirestore = (doc) => {
  const data = doc.data();
  return new AssignmentModel({
    id: doc.id,
    sura: data.sura,
    startPage: data.startPage,
    endPage: data.endPage,
    assignedDate: data.assignedDate?.toDate
      ? data.assignedDate.toDate()
      : new Date(data.assignedDate),
    dueDate: data.dueDate?.toDate
      ? data.dueDate.toDate()
      : data.dueDate
        ? new Date(data.dueDate)
        : null,
    notes: data.notes || "",
  });
};

AssignmentModel.prototype.toFirestore = function () {
  return {
    sura: this.sura,
    startPage: this.startPage,
    endPage: this.endPage,
    assignedDate: this.assignedDate,
    dueDate: this.dueDate,
    notes: this.notes,
  };
};

module.exports = AssignmentModel;
