const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

console.log("📁 teatcherRoutes.js LOADED ✅");

// 🧭 ضع الراوتات الثابتة أولاً
router.get('/debug', (req, res) => {
  console.log('🔥 /api/teachers/debug hit');
  res.send('Route works!');
});

// ✅ بعدين الباقي
router.get('/', teacherController.getAll);
router.post('/', teacherController.create);
router.put('/:id/add-student', teacherController.addStudent);

// ⚠️ خلي الراوت الديناميكي (/:id) آخر واحد
router.get('/:id', teacherController.getById);

module.exports = router;
