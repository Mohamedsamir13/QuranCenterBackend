// models/dailyPlansModel.js
class DailyPlan {
  constructor({
    memorization,
    revision,
    notes = "",
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.memorization = memorization;
    // مثال:
    // { sura: "يوسف", fromPage: 1, pagesCount: 3 }

    this.revision = revision;
    // مثال:
    // { sura: "البقرة", fromPage: 1, pagesCount: 10 }

    this.notes = notes;

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toFirestore() {
    return {
      memorization: this.memorization,
      revision: this.revision,
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
