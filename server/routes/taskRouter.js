const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/', taskController.getAllTasks());
router.get('/:id', taskController.getTaskById());
router.post('/', authenticate.authenticate, authenticate.authorize, taskController.createTask);
router.put('/:id', authenticate.authenticate, authenticate.authorize, taskController.updateTask());
router.delete('/:id', authenticate.authenticate, authenticate.authorize , taskController.deleteTask());

module.exports = router;