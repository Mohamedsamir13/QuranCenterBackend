// src/models/studentModel.js
class StudentModel {
  constructor({ id, name, group, reports = [] }) {
    this.id = id;
    this.name = name;
    this.group = group;
    this.reports = reports;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new StudentModel({
      id: doc.id,
      name: data.name,
      group: data.group,
      reports: data.reports || [],
    });
  }

  toFirestore() {
    return {
      name: this.name,
      group: this.group,
      reports: this.reports,
    };
  }
}

module.exports = StudentModel;
