const stageRepo = require("../repositories/goalsRepo");
const dailyRepo = require("../repositories/dailyPlansRepo");

exports.addStageGoal = (studentId, data) =>
  stageRepo.createStageGoal(studentId, data);

exports.getStageGoals = (studentId) => stageRepo.getStageGoals(studentId);

exports.updateStageGoal = (studentId, goalId, data) =>
  stageRepo.updateStageGoal(studentId, goalId, data);

exports.addDailyPlan = (studentId, data) =>
  dailyRepo.createDailyPlan(studentId, data);

exports.getDailyPlans = (studentId) => dailyRepo.getDailyPlans(studentId);

exports.updateDailyPlan = (studentId, planId, data) =>
  dailyRepo.updateDailyPlan(studentId, planId, data);

exports.deleteDailyPlan = (studentId, planId) =>
  dailyRepo.deleteDailyPlan(studentId, planId);
