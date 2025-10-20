// ...existing code...
const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');

// routes
router.get('/', studentController.getAll);
router.post('/create-student', studentController.create);
router.get('/:id', studentController.getById);

// add report: POST /api/students/:id/reports
router.post('/:id/reports', studentController.addReport);

module.exports = router;
