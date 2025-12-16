const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// Create processing task
router.post('/', taskController.createTask);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get task by ID
router.get('/:id', taskController.getTaskById);

// Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
