// src/routes/studentRoutes.js
const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const { getAllLimiter } = require('../middleWares/rateLimiter');
const { verifyToken } = require('../middleWares/authMiddleware');

router.get('/', verifyToken, getAllLimiter, studentController.getAll);

// باقي الـ routes
router.post('/create-student',  studentController.create);
router.get('/:id',  studentController.getById);
router.post('/:id/reports',  studentController.addReport);

module.exports = router;
