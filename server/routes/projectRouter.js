const express = require('express');
const projectController = require('../controllers/projectController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/allprojects', authenticate.authenticate, authenticate.authorize,projectController.getAllProjects);
router.get('/getsingleproject/:idproject',authenticate.authenticate, authenticate.authorize, projectController.getProjectById);
router.post('/newproject',authenticate.authenticate, authenticate.authorize, projectController.createProject); //authenticate.authenticate, authenticate.authorize,
router.patch('/updateproject/:idproject', authenticate.authenticate, authenticate.authorize, projectController.updateProject); //authenticate.authenticate, authenticate.authorize,
router.delete('/deleteproject/:idproject',authenticate.authenticate, authenticate.authorize, projectController.deleteProject); // authenticate.authenticate, authenticate.authorize ,
router.get('/FTOEP/:idproject',authenticate.authenticate, authenticate.authorize, projectController.findTasksOfEachProject); // authenticate.authenticate, authenticate.authorize ,
router.patch('/addUserToProject/:idproject/:userID',authenticate.authenticate, authenticate.authorize,  projectController.addUserToProject); //authenticate.authenticate, authenticate.authorize,
router.get('/getprojectname/:projectId', projectController.getProjectNameById); // authenticate.authenticate, authenticate.authorize,

module.exports = router;