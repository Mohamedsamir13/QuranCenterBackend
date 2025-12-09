const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const { getAllLimiter } = require("../middleWares/rateLimiter");
const { verifyToken } = require("../middleWares/authMiddleware");

console.log("📁 teatcherRoutes.js LOADED ✅");

router.get("/debug", (req, res) => {
  console.log("🔥 /api/teachers/debug hit");
  res.send("Route works!");
});

// 🟢 Get all teachers
router.get("/", getAllLimiter, teacherController.getAll);

// 🟢 Create new teacher
router.post("/", teacherController.create);

// 🟣 Add student to teacher
router.put("/:id/add-student", teacherController.addStudent);

// 🟢 Get teacher by ID
router.get("/:id", teacherController.getById);

// 🟡 Update teacher (name أو أي بيانات تانية)
router.put("/:id", teacherController.update); // ✅ هنا مفيش () في الآخر

// 🔴 Delete teacher
router.delete("/:id", teacherController.remove); // 👈 NEW

module.exports = router;
