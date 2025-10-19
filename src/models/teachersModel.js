class TeacherModel {
  constructor({ id, name, students = [] }) {
    this.id = id;
    this.name = name;
    this.students = students;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new TeacherModel({
      id: doc.id,
      name: data.name,
      students: data.students || [],
    });
  }

  toFirestore() {
    return {
      name: this.name,
      students: this.students,
    };
  }
}

module.exports = TeacherModel;
