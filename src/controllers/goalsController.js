const service = require("../services/goalsService");

// Stage Goal (Singleton)
exports.upsertStageGoal = async (req, res) => {
  const { id } = req.params;
  const data = await service.saveStageGoal(id, req.body);

  res.json({ success: true, data });
};

exports.getStageGoal = async (req, res) => {
  const { id } = req.params;
  const data = await service.getStageGoal(id);

  res.json({ success: true, data });
};

exports.deleteStageGoal = async (req, res) => {
  const { id } = req.params;
  await service.deleteStageGoal(id);

  res.json({ success: true });
};

// Daily Plan
exports.upsertDailyPlan = async (req, res) => {
  const { id } = req.params;
  const data = await service.saveDailyPlan(id, req.body);

  res.json({ success: true, data });
};

exports.getDailyPlan = async (req, res) => {
  const { id } = req.params;
  const data = await service.getDailyPlan(id);

  res.json({ success: true, data });
};

exports.deleteDailyPlan = async (req, res) => {
  const { id } = req.params;
  await service.deleteDailyPlan(id);

  res.json({ success: true });
};
