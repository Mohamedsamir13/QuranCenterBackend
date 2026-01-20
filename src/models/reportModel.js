const { admin } = require("../config/firebase"); // 👈 تأكد من المسار الصحيح

class ReportModel {
  constructor({
    id,
    date,
    minutes,
    sura,
    startAya,
    endAya,
    remaining_pages,
    performance,
    notes,
    teacherId = null,
    report_for_parents = null,
    type_of_session = null,
    createdAt = null, // 👈 NEW
  }) {
    this.id = id;
    this.date = date;
    this.minutes = minutes;
    this.sura = sura;
    this.startAya = startAya;
    this.endAya = endAya;
    this.remaining_pages = remaining_pages;
    this.performance = performance;
    this.notes = notes;
    this.teacherId = teacherId;
    this.report_for_parents = report_for_parents;
    this.type_of_session = type_of_session;
    this.createdAt = createdAt;
  }

  toFirestore() {
    return {
      date: this.date,
      minutes: this.minutes,
      sura: this.sura,
      startAya: this.startAya,
      endAya: this.endAya,
      remaining_pages: this.remaining_pages,
      performance: this.performance,
      notes: this.notes,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // 👈 أهم سطر
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
