// models/groupModel.js

class GroupModel {
  constructor({
    id = null,
    name,
    place,
    day,
    teacherId = null,
    students = [],
    createdAt = null,
  }) {
    this.id = id;
    this.name = name;
    this.place = place;
    this.day = day;
    this.teacherId = teacherId;
    this.students = students;
    this.createdAt = createdAt || new Date().toISOString();
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new GroupModel({
      id: doc.id,
      name: data.name,
      place: data.place,
      day: data.day,
      teacherId: data.teacherId || null,
      students: data.students || [],
      createdAt: data.createdAt || null,
    });
  }

  toFirestore() {
    return {
      name: this.name,
      place: this.place,
      day: this.day,
      teacherId: this.teacherId || null,
      students: this.students || [],
      createdAt: this.createdAt || new Date().toISOString(),
    };
  }
}

module.exports = GroupModel;
