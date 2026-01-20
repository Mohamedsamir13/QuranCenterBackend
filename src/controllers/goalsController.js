const service = require("../services/goalsService");

// Stage Goal
exports.createStageGoal = async (req, res) => {
  const { id } = req.params;
  const result = await service.addStageGoal(id, req.body);
  res.status(201).json({ success: true, data: result });
};

exports.getStageGoals = async (req, res) => {
  const { id } = req.params;
  const data = await service.getStageGoals(id);
  res.json({ success: true, data });
};

exports.updateStageGoal = async (req, res) => {
  const { id, goalId } = req.params;
  const data = await service.updateStageGoal(id, goalId, req.body);
  res.json({ success: true, data });
};

// Daily Plans
exports.createDailyPlan = async (req, res) => {
  const { id } = req.params;
  const data = await service.addDailyPlan(id, req.body);
  res.status(201).json({ success: true, data });
};

exports.getDailyPlans = async (req, res) => {
  const { id } = req.params;
  const data = await service.getDailyPlans(id);
  res.json({ success: true, data });
};

exports.updateDailyPlan = async (req, res) => {
  const { id, planId } = req.params;
  const data = await service.updateDailyPlan(id, planId, req.body);
  res.json({ success: true, data });
};

exports.deleteDailyPlan = async (req, res) => {
  const { id, planId } = req.params;
  await service.deleteDailyPlan(id, planId);
  res.json({ success: true });
};
