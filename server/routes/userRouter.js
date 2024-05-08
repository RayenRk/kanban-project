const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/getAllUser', userController.getAllUsers);
router.post('/createUser', userController.createUser);

router.get('/:id', userController.getUserById);
router.post('/create', authenticate.authenticate, authenticate.authorize, userController.createUser);
router.put('/:id', authenticate.authenticate, authenticate.authorize, userController.updateUser);
router.delete('/:id', authenticate.authenticate, authenticate.authorize , userController.deleteUser);

module.exports = router;