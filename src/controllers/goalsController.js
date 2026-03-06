const service = require("../services/goalsService");

// Stage Goal (Singleton)
// Stage Goal
exports.upsertStageGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.saveStageGoal(id, req.body);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStageGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.getStageGoal(id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteStageGoal = async (req, res) => {
  try {
    const { id } = req.params;

    await service.deleteStageGoal(id);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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
