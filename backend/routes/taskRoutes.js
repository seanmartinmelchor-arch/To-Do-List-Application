// Maps URLs + HTTP methods to controller functions.
const express = require('express');
const c = require('../controllers/taskController');

const router = express.Router();

router.route('/').get(c.getTasks).post(c.createTask);
router.route('/:id').get(c.getTaskById).put(c.updateTask).delete(c.deleteTask);
router.patch('/:id/complete', c.completeTask);

module.exports = router;
