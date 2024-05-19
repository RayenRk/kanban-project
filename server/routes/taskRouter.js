const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/alltasks', authenticate.authenticate, authenticate.authorize,taskController.getAllTasks);
router.get('/getsingletask/:idtask', taskController.getTaskById,authenticate.authenticate, authenticate.authorizeAdminPo,);
router.post('/newTask/:idproject', authenticate.authenticate,authenticate.authorizeAdminPo,taskController.newTask);// authenticate.authorize,
router.patch('/updatetask/:idtask',authenticate.authenticate, authenticate.authorizeAll, taskController.updateTask); // authenticate.authenticate, authenticate.authorize,
router.delete('/deletetask/:idtask', authenticate.authenticate, authenticate.authorizeAdminPo, taskController.deleteTask); //authenticate.authenticate, authenticate.authorize ,
router.post('/createTask', authenticate.authenticate, authenticate.authorize,taskController.createTask); // authenticate.authenticate, authenticate.authorize,
router.patch('/addUserToTask/:taskId/:userId',authenticate.authenticate, authenticate.authorizeAdminPo, taskController.addUserToTask); // authenticate.authenticate, authenticate.authorize,
router.get('/getUserTask/:idtask',authenticate.authenticate, authenticate.authorizeAll,taskController.getTasksByUser);

module.exports = router;
