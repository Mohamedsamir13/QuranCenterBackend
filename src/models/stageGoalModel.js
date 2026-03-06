// models/stageGoalModel.js

module.exports = {
  toFirestore(data) {
    return {
      stageStartDate: data.stageStartDate || null,
      stageEndDate: data.stageEndDate || null,

      targets: (data.targets || []).map((t) => ({
        type: t.type, // memorization | revision
        suraFrom: t.suraFrom,
        suraTo: t.suraTo,
        fromPage: t.fromPage,
        toPage: t.toPage,
        pagesPerCycle: t.pagesPerCycle,
      })),

      updatedAt: new Date(),
      createdAt: data.createdAt || new Date(),
    };
  },
};
