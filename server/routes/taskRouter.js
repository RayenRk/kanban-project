const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/alltasks',  taskController.getAllTasks);
router.get('/getsingletask/:idtask', taskController.getTaskById,);
router.post('/newTask/:idproject', taskController.newTask);
router.patch('/updatetask/:idtask', taskController.updateTask); // 
router.delete('/deletetask/:idtask',  taskController.deleteTask); //authenticate.authenticate, authenticate.authorize ,
router.post('/createTask', taskController.createTask); // 
router.patch('/addUserToTask/:taskId/:userId', taskController.addUserToTask); // 
router.get('/alltasksbyuser/:userId',taskController.getAllTasksByUser); // 

module.exports = router;