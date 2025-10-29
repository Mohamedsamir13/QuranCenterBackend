// src/routes/studentRoutes.js
const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const { getAllLimiter } = require('../middleWares/rateLimiter');
const { verifyToken } = require('../middleWares/authMiddleware');

// 🧱 حماية endpoint getAll
router.get('/', verifyToken, getAllLimiter, studentController.getAll);

// باقي الـ routes
router.post('/create-student', verifyToken, studentController.create);
router.get('/:id', verifyToken, studentController.getById);
router.post('/:id/reports', verifyToken, studentController.addReport);

module.exports = router;
