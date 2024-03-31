const express = require('express');
const projectController = require('../controllers/projectController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/allprojects', projectController.getAllProjects);
router.get('/getsingleproject/:idproject', projectController.getProjectById);
router.post('/newproject', projectController.createProject); //authenticate.authenticate, authenticate.authorize,
router.patch('/updateproject/:idproject',  projectController.updateProject); //authenticate.authenticate, authenticate.authorize,
router.delete('/deleteproject/:idproject', projectController.deleteProject); // authenticate.authenticate, authenticate.authorize ,
router.get('/FTOEP/:idproject', projectController.findTasksOfEachProject); // authenticate.authenticate, authenticate.authorize ,

module.exports = router;