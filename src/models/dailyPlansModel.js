// models/dailyPlansModel.js
module.exports = {
  toFirestore(data) {
    return {
      plans: data.plans.map((p) => ({
        type: p.type, // memorization | revision
        startSura: p.startSura,
        pagesPerDay: p.pagesPerDay,
      })),
      notes: data.notes || "",
      updatedAt: new Date(),
      createdAt: data.createdAt || new Date(),
    };
  },
};
