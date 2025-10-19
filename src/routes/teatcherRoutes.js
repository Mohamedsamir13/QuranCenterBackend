const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// routes
router.get('/', teacherController.getAll);
router.get('/:id', teacherController.getById);
router.post('/', teacherController.create);
router.put('/:id/add-student', teacherController.addStudent);

module.exports = router;
