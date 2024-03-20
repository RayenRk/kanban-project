const express = require('express');
const projectController = require('../controllers/projectController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authenticate.authenticate, authenticate.authorize, projectController.createProject);
router.put('/:id', authenticate.authenticate, authenticate.authorize, projectController.updateProject);
router.delete('/:id', authenticate.authenticate, authenticate.authorize , projectController.deleteProject);

module.exports = router;