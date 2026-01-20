class DailyPlan {
  constructor({
    date,
    memorization,
    revision,
    status = "planned",
    notes = "",
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.date = date;

    this.memorization = memorization; // { sura, fromPage, toPage }
    this.revision = revision; // { sura, fromPage, toPage }

    this.status = status; // planned | completed | postponed
    this.notes = notes;

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toFirestore() {
    return {
      date: this.date,
      memorization: this.memorization,
      revision: this.revision,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(doc) {
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = DailyPlan;
