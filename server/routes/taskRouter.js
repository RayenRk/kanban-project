const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/alltasks', authenticate.authenticate, authenticate.authorize, taskController.getAllTasks);
router.get('/getsingletask/:idtask', taskController.getTaskById,authenticate.authenticate, authenticate.authorize,);
router.post('/newtask/:userId', authenticate.authenticate, authenticate.authorize,taskController.newTask);
router.patch('/updatetask/:idtask', taskController.updateTask); // authenticate.authenticate, authenticate.authorize,
router.delete('/deletetask/:idtask', taskController.deleteTask); //authenticate.authenticate, authenticate.authorize ,
router.post('/createTask', authenticate.authenticate, authenticate.authorize,taskController.createTask); // authenticate.authenticate, authenticate.authorize,
router.patch('/addUserToTask/:taskId/:userId',authenticate.authenticate, authenticate.authorize, taskController.addUserToTask); // authenticate.authenticate, authenticate.authorize,
router.get('/alltasksbyuser/:userId',taskController.getAllTasksByUser); // authenticate.authenticate, authenticate.authorize,
router.get('/alltasksbyuserandproject/:projectId/:userId',taskController.getAllTasksByUserAndProject); // authenticate.authenticate, authenticate.authorize,
router.post('/newtaskwithproject/:projectId/:userId', taskController.newTaskWithProject); // authenticate.authenticate, authenticate.authorize,

module.exports = router;
