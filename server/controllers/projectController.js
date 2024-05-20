const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

//get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    //console.log(projects);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "An Error occurred" });
  }
};

const findTasksOfEachProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.idproject).populate(
      "tasks"
    );
    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get single project using ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.idproject);
    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//creating project
const createProject = async (req, res) => {
  try {
    // const project = await Project.create(req.body);
    // console.log(project);
    // if(project){
    //     res.status(201).json({ message: 'Project created successfully' });
    // }
    const project = req.body;
    const newProject = new Project(project);
    await newProject.save();
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
const addUserToProject = async (req, res) => {
  try {
    const PROJECT = await Project.findById(req.params.idproject);
    console.log(PROJECT);
    const project = await Project.findByIdAndUpdate(
      req.params.idproject,

      { $push: { members: req.params.userID } },
      { new: true }
    );
    console.log(project);
    if (!project || !PROJECT) {
      res.status(404).send(`No project with id`);
    }
    {
      res.status(200).send("Project updated succesflly");
    }
  } catch (e) {}
};
//updating Project

const updateProject = async (req, res) => {
  try {
    const PROJECT = await Project.findById(req.params.idproject);
    console.log(PROJECT);

    const project = await Project.findByIdAndUpdate(
      req.params.idproject,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      res.status(404).send(`No project with id`);
    }
    {
      res.status(200).send("Project updated succesflly");
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// delete a Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.idproject);
    if (!project) {
      return res.status(404).json({ error: "Pproject not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    // Delete project from database
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'An error occurred while deleting project' });
  }
};


const getProjectNameById = async (req, res) => {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json({ projectName: project.name });
    } catch (error) {
      console.error("Error fetching project name:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching project name" });
    }
  };

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  findTasksOfEachProject,
  addUserToProject,
  getProjectNameById, 
  removeProject,
};
