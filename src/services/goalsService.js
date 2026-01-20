const stageRepo = require("../repositories/goalsRepo");
const dailyRepo = require("../repositories/dailyPlansRepo");

// Stage Goals (زي ما هي)
exports.addStageGoal = (studentId, data) =>
  stageRepo.createStageGoal(studentId, data);

exports.getStageGoals = (studentId) => stageRepo.getStageGoals(studentId);

exports.updateStageGoal = (studentId, goalId, data) =>
  stageRepo.updateStageGoal(studentId, goalId, data);

// Daily Plan (Singleton)
exports.saveDailyPlan = (studentId, data) =>
  dailyRepo.saveDailyPlan(studentId, data);

exports.getDailyPlan = (studentId) => dailyRepo.getDailyPlan(studentId);

exports.deleteDailyPlan = (studentId) => dailyRepo.deleteDailyPlan(studentId);
