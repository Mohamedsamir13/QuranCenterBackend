const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { getAllLimiter } = require('../middleWares/rateLimiter');
const { verifyToken } = require('../middleWares/authMiddleware');
console.log("📁 teatcherRoutes.js LOADED ✅");

router.get('/debug', (req, res) => {
  console.log('🔥 /api/teachers/debug hit');
  res.send('Route works!');
});

router.get('/', getAllLimiter, teacherController.getAll);
router.post('/', teacherController.create);
router.put('/:id/add-student', teacherController.addStudent);

router.get('/:id', teacherController.getById);

module.exports = router;
