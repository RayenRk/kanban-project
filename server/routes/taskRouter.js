const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/alltasks', taskController.getAllTasks);
router.get('/getsingletask/:idtask', taskController.getTaskById);
router.post('/newTask/:idproject', taskController.createTask);
router.patch('/updatetask/:idtask', taskController.updateTask);
router.delete('/deletetask/:idtask', taskController.deleteTask);
router.post('/createTask', taskController.createTask);
router.post('/:idtask/assign', authenticate, authorize, taskController.assignTask);

module.exports = router;
