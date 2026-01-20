class StudentModel {
  constructor({ id, name, age, group, teacherId, riwaya }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.group = group;
    this.teacherId = teacherId;
    this.riwaya = riwaya;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new StudentModel({
      id: doc.id,
      name: data.name,
      age: data.age,
      group: data.group,
      teacherId: data.teacherId,
      riwaya: data.riwaya || "",
    });
  }

  toFirestore() {
    return {
      name: this.name,
      age: this.age,
      group: this.group,
      teacherId: this.teacherId,
      riwaya: this.riwaya,
    };
  }
}

module.exports = StudentModel;
