const { db } = require("../config/firebase");
const StageGoalModel = require("../models/stageGoalModel");

const studentRef = (id) => db.collection("students").doc(id);

exports.upsertStageGoal = async (studentId, data) => {
  const ref = studentRef(studentId);

  await ref.update({
    stageGoal: StageGoalModel.toFirestore(data),
  });

  return data;
};

exports.getStageGoal = async (studentId) => {
  const doc = await studentRef(studentId).get();
  if (!doc.exists) return null;

  return doc.data().stageGoal || null;
};

exports.deleteStageGoal = async (studentId) => {
  await studentRef(studentId).update({
    stageGoal: null,
  });
  return true;
};
