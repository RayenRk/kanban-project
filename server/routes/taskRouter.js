const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/alltasks', taskController.getAllTasks);
router.get('/getsingletask/:idtask', taskController.getTaskById,authenticate.authenticate, authenticate.authorize,);
router.post('/newTask/:idproject', taskController.newTask);
router.patch('/updatetask/:idtask', taskController.updateTask); // authenticate.authenticate, authenticate.authorize,
router.delete('/deletetask/:idtask',  taskController.deleteTask); //authenticate.authenticate, authenticate.authorize ,
router.post('/createTask', taskController.createTask); // authenticate.authenticate, authenticate.authorize,
router.patch('/addUserToTask/:taskId/:userId', taskController.addUserToTask); // authenticate.authenticate, authenticate.authorize,

module.exports = router;
