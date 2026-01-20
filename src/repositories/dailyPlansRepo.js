const { db } = require("../config/firebase");
const DailyPlan = require("../models/dailyPlansModel");

// ثابت: Document واحد فقط لكل طالب
const dailyPlanRef = (studentId) =>
  db.collection("students").doc(studentId).collection("meta").doc("dailyPlan");

/**
 * Create OR Update Daily Plan (Upsert)
 * الطالب لا يمكن أن يكون له أكثر من DailyPlan
 */
exports.saveDailyPlan = async (studentId, data) => {
  const plan = new DailyPlan(data);

  const ref = dailyPlanRef(studentId);

  await ref.set(plan.toFirestore(), { merge: true });

  return { id: "dailyPlan", ...plan };
};

/**
 * Get Daily Plan
 */
exports.getDailyPlan = async (studentId) => {
  const ref = dailyPlanRef(studentId);
  const doc = await ref.get();

  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
};

/**
 * Delete Daily Plan (اختياري)
 */
exports.deleteDailyPlan = async (studentId) => {
  const ref = dailyPlanRef(studentId);
  await ref.delete();
  return true;
};
