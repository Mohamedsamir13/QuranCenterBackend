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
    teacherId = null, // ✅ Default to null if not provided
  }) {
    this.id = id;
    this.date = date;
    this.minutes = minutes;
    this.sura = sura;
    this.aya = aya;
    this.remaining_pages = remaining_pages;
    this.performance = performance;
    this.notes = notes;
    this.teacherId = teacherId ?? null; // ✅ Force null if undefined
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new ReportModel({
      id: doc.id,
      ...data,
      teacherId: data.teacherId ?? null, // ✅ Ensure it's present even if missing
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
      ...(this.teacherId ? { teacherId: this.teacherId } : {}), // ✅ Only include if not null
    };
  }
}

module.exports = ReportModel;
