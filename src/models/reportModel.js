class ReportModel {
  constructor({
    id,
    date,
    minutes,
    sura,
    aya,
    remaining_pages,
    performance,
    notes,
    teacherId = null,
    report_for_parents = null,
    type_of_session = null, // 👈 NEW FIELD (tasmee3 or muraja3a)
  }) {
    this.id = id;
    this.date = date;
    this.minutes = minutes;
    this.sura = sura;
    this.aya = aya;
    this.remaining_pages = remaining_pages;
    this.performance = performance;
    this.notes = notes;
    this.teacherId = teacherId ?? null;
    this.report_for_parents = report_for_parents ?? null;
    this.type_of_session = type_of_session ?? null; // 👈 NEW
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new ReportModel({
      id: doc.id,
      ...data,
      teacherId: data.teacherId ?? null,
      report_for_parents: data.report_for_parents ?? null,
      type_of_session: data.type_of_session ?? null, // 👈 NEW
    });
  }

  toFirestore() {
    return {
      date: this.date,
      minutes: this.minutes,
      sura: this.sura,
      aya: this.aya,
      remaining_pages: this.remaining_pages,
      performance: this.performance,
      notes: this.notes,
      ...(this.teacherId ? { teacherId: this.teacherId } : {}),
      ...(this.report_for_parents
        ? { report_for_parents: this.report_for_parents }
        : {}),
      ...(this.type_of_session
        ? { type_of_session: this.type_of_session }
        : {}), // 👈 NEW
    };
  }
}

module.exports = ReportModel;
