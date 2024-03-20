const Project = require('../models/projectModel');
const mongoose = require('mongoose');



//get all projects
const getAllProjects = async  (req, res)=>{
    try{
        const  projects = await Project.find();
        res.status(200).json(projects);

    }catch (error){
        res.status(500).json({message: 'An Error occurred'});
    }
}

//get single project using ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "project not found" });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//creating project
const createProject = async (req, res) => {
    try {
        const project = req.body;
        const newProject = new Project(project);
        await newProject.save();
        res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

//updating Project

const  updateProject= async (req, res) => {
    try {
        const { id } = req.params;
        const project = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No project with id: ${id}`);
        const updatedProject = await Project.findByIdAndUpdate(id, project, { new: true });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

// delete a Project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Pproject not found" });
        }
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };