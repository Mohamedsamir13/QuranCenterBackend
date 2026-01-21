const express = require("express");
const router = express.Router();
const controller = require("../controllers/goalsController");
const { getAllLimiter, writeLimiter } = require("../middleWares/rateLimiter");

// Stage Goal (Singleton)
router.put("/:id/stage-goal", writeLimiter, controller.upsertStageGoal);
router.get("/:id/stage-goal", getAllLimiter, controller.getStageGoal);
router.delete("/:id/stage-goal", writeLimiter, controller.deleteStageGoal);

// Daily Plan (Singleton)
router.put("/:id/daily-plan", writeLimiter, controller.upsertDailyPlan);
router.get("/:id/daily-plan", getAllLimiter, controller.getDailyPlan);
router.delete("/:id/daily-plan", writeLimiter, controller.deleteDailyPlan);

module.exports = router;
