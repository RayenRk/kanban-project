const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const taskController = require("../controllers/taskController");

const router = express.Router();

router.get('/getAllUser',authenticate.authenticate, authenticate.authorize, userController.getAllUsers);
router.post('/createUser',authenticate.authenticate, authenticate.authorize, userController.createUser);
router.get('/:id', authenticate.authenticate, authenticate.authorize,userController.getUserById);
router.post('/create', authenticate.authenticate, authenticate.authorize, userController.createUser);
router.put('/:id', authenticate.authenticate, authenticate.authorize, userController.updateUser);
router.delete('/:id', authenticate.authenticate, authenticate.authorize , userController.deleteUser);

module.exports = router;