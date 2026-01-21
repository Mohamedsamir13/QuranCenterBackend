const { db } = require("../config/firebase");
const DailyPlanModel = require("../models/dailyPlansModel");

const studentRef = (id) => db.collection("students").doc(id);

exports.upsertDailyPlan = async (studentId, data) => {
  await studentRef(studentId).update({
    dailyPlan: DailyPlanModel.toFirestore(data),
  });

  return data;
};

exports.getDailyPlan = async (studentId) => {
  const doc = await studentRef(studentId).get();
  if (!doc.exists) return null;

  return doc.data().dailyPlan || null;
};

exports.deleteDailyPlan = async (studentId) => {
  await studentRef(studentId).update({
    dailyPlan: null,
  });
  return true;
};
