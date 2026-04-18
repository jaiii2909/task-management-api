const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { createTaskSchema, updateTaskSchema } = require('../validators/schemas');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// All task routes require authentication
router.use(auth);

// Task routes
router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
