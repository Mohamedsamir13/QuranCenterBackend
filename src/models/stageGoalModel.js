///models/stageGoalModel.js
class StageGoal {
  constructor({
    stageStartDate,
    stageEndDate,
    memorization,
    revision,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.stageStartDate = stageStartDate;
    this.stageEndDate = stageEndDate;

    this.memorization = memorization; // { fromPage, toPage }
    this.revision = revision; // { fromPage, toPage }

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toFirestore() {
    return {
      stageStartDate: this.stageStartDate,
      stageEndDate: this.stageEndDate,
      memorization: this.memorization,
      revision: this.revision,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(doc) {
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = StageGoal;
