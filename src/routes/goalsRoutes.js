const express = require("express");
const router = express.Router();
const controller = require("../controllers/goalsController");
const { getAllLimiter, writeLimiter } = require("../middleWares/rateLimiter");

// Stage Goals
router.post("/:id/stage-goals", writeLimiter, controller.createStageGoal);
router.get("/:id/stage-goals", getAllLimiter, controller.getStageGoals);
router.put(
  "/:id/stage-goals/:goalId",
  writeLimiter,
  controller.updateStageGoal,
);

// Daily Plans
router.put("/:id/daily-plan", writeLimiter, controller.upsertDailyPlan);

router.get("/:id/daily-plan", getAllLimiter, controller.getDailyPlan);

router.delete("/:id/daily-plan", writeLimiter, controller.deleteDailyPlan);
module.exports = router;
