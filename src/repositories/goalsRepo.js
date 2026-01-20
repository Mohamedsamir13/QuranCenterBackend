const { db } = require("../config/firebase");
const StageGoal = require("../models/stageGoalModel");

exports.createStageGoal = async (studentId, data) => {
  const goal = new StageGoal(data);
  const ref = await db
    .collection("students")
    .doc(studentId)
    .collection("stageGoals")
    .add(goal.toFirestore());

  await ref.update({ id: ref.id });
  return { id: ref.id, ...goal };
};

exports.getStageGoals = async (studentId) => {
  const snap = await db
    .collection("students")
    .doc(studentId)
    .collection("stageGoals")
    .get();

  return snap.docs.map(StageGoal.fromFirestore);
};

exports.updateStageGoal = async (studentId, goalId, data) => {
  const ref = db
    .collection("students")
    .doc(studentId)
    .collection("stageGoals")
    .doc(goalId);

  await ref.update({ ...data, updatedAt: new Date() });
  return { id: goalId, ...data };
};
exports.deleteStageGoal = async (studentId, goalId) => {
  const ref = db
    .collection("students")
    .doc(studentId)
    .collection("stageGoals")
    .doc(goalId);

  await ref.delete();
  return true;
};
