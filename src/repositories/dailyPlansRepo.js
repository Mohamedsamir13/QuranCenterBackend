const { db } = require("../config/firebase");
const DailyPlan = require("../models/dailyPlansModel");

exports.createDailyPlan = async (studentId, data) => {
  const plan = new DailyPlan(data);
  const ref = await db
    .collection("students")
    .doc(studentId)
    .collection("dailyPlans")
    .add(plan.toFirestore());

  await ref.update({ id: ref.id });
  return { id: ref.id, ...plan };
};

exports.getDailyPlans = async (studentId) => {
  const snap = await db
    .collection("students")
    .doc(studentId)
    .collection("dailyPlans")
    .orderBy("date", "desc")
    .get();

  return snap.docs.map(DailyPlan.fromFirestore);
};

exports.updateDailyPlan = async (studentId, planId, data) => {
  const ref = db
    .collection("students")
    .doc(studentId)
    .collection("dailyPlans")
    .doc(planId);

  await ref.update({ ...data, updatedAt: new Date() });
  return { id: planId, ...data };
};

exports.deleteDailyPlan = async (studentId, planId) => {
  await db
    .collection("students")
    .doc(studentId)
    .collection("dailyPlans")
    .doc(planId)
    .delete();

  return true;
};
