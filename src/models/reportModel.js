const { admin } = require("../config/firebase");

class ReportModel {
  constructor({
    id,
    date,
    minutes,
    notes,
    performance,
    suraList = [], // 🔹 بدل الحقول المفردة
    teacherId = null,
    report_for_parents = null,
    type_of_session = null,
    createdAt = null,
  }) {
    this.id = id;
    this.date = date;
    this.minutes = minutes;
    this.notes = notes;
    this.performance = performance;
    this.suraList = suraList; // List of suras
    this.teacherId = teacherId;
    this.report_for_parents = report_for_parents;
    this.type_of_session = type_of_session;
    this.createdAt = createdAt;
  }

  toFirestore() {
    return {
      date: this.date,
      minutes: this.minutes,
      notes: this.notes,
      performance: this.performance,
      suraList: this.suraList.map((sura) => ({
        name: sura.name, // اسم السورة
        startAya: sura.startAya, // بداية الآية
        endAya: sura.endAya, // نهاية الآية
      })),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(this.teacherId ? { teacherId: this.teacherId } : {}),
      ...(this.report_for_parents
        ? { report_for_parents: this.report_for_parents }
        : {}),
      ...(this.type_of_session
        ? { type_of_session: this.type_of_session }
        : {}),
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new ReportModel({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? null,
    });
  }
}

module.exports = ReportModel;
