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
// Daily Plan (Singleton)

exports.upsertDailyPlan = async (req, res) => {
  const { id } = req.params;
  const data = await service.saveDailyPlan(id, req.body);

  res.status(200).json({
    success: true,
    data,
  });
};

exports.getDailyPlan = async (req, res) => {
  const { id } = req.params;
  const data = await service.getDailyPlan(id);

  res.json({
    success: true,
    data,
  });
};

exports.deleteDailyPlan = async (req, res) => {
  const { id } = req.params;
  await service.deleteDailyPlan(id);

  res.json({ success: true });
};
