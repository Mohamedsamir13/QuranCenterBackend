class Goal {
  constructor({ targetType, targetValue, achievedValue = 0, startDate, endDate }) {
    this.targetType = targetType; // "pages", "surahs", or "juz"
    this.targetValue = targetValue;
    this.achievedValue = achievedValue;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

class StudentModel {
  constructor({ id, name, age, group, teacherId, riwaya, goal = null }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.group = group;
    this.teacherId = teacherId;
    this.riwaya = riwaya; // 🎯 New attribute
    this.goal = goal ? new Goal(goal) : null;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new StudentModel({
      id: doc.id,
      name: data.name,
      age: data.age,
      group: data.group,
      teacherId: data.teacherId,
      riwaya: data.riwaya || '', // ✅ added here
      goal: data.goal || null,
    });
  }

  toFirestore() {
    return {
      name: this.name,
      age: this.age,
      group: this.group,
      teacherId: this.teacherId,
      riwaya: this.riwaya, // ✅ added here
      goal: this.goal,
    };
  }
}

module.exports = StudentModel;
