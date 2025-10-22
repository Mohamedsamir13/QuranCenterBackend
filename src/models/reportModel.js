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
    teacherId,
  }) {
    this.id = id;
    this.date = date;
    this.minutes = minutes;
    this.sura = sura;
    this.aya = aya;
    this.remaining_pages = remaining_pages;
    this.performance = performance;
    this.notes = notes;
    this.teacherId = teacherId;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new ReportModel({
      id: doc.id,
      ...data,
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
      teacherId: this.teacherId,
    };
  }
}

module.exports = ReportModel;
