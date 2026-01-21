// models/stageGoalModel.js
module.exports = {
  toFirestore(data) {
    return {
      stageStartDate: data.stageStartDate,
      stageEndDate: data.stageEndDate,

      memorization: {
        pagesPerCycle: data.memorization.pagesPerCycle,
        from: data.memorization.from,
        to: data.memorization.to,
      },

      revision: {
        pagesPerCycle: data.revision.pagesPerCycle,
        from: data.revision.from,
        to: data.revision.to,
      },

      updatedAt: new Date(),
      createdAt: data.createdAt || new Date(),
    };
  },
};
