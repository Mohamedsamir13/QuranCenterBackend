const stageRepo = require("../repositories/goalsRepo");
const dailyRepo = require("../repositories/dailyPlansRepo");

exports.saveStageGoal = (studentId, data) =>
  stageRepo.upsertStageGoal(studentId, data);

exports.getStageGoal = (studentId) => stageRepo.getStageGoal(studentId);

exports.deleteStageGoal = (studentId) => stageRepo.deleteStageGoal(studentId);

// Daily Plan
exports.saveDailyPlan = (studentId, data) =>
  dailyRepo.upsertDailyPlan(studentId, data);

exports.getDailyPlan = (studentId) => dailyRepo.getDailyPlan(studentId);

exports.deleteDailyPlan = (studentId) => dailyRepo.deleteDailyPlan(studentId);
