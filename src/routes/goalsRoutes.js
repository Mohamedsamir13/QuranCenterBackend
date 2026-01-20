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
router.post("/:id/daily-plans", writeLimiter, controller.createDailyPlan);
router.get("/:id/daily-plans", getAllLimiter, controller.getDailyPlans);
router.put(
  "/:id/daily-plans/:planId",
  writeLimiter,
  controller.updateDailyPlan,
);
router.delete(
  "/:id/daily-plans/:planId",
  writeLimiter,
  controller.deleteDailyPlan,
);

module.exports = router;
