const Task = require('../models/taskModel');
const mongoose = require('mongoose');


//get all projects
const getAllTasks = async  (req, res)=>{
    try{
        const  task = await Task.find();
        res.status(200).json(task);

    }catch (error){
        res.status(500).json({message: 'An Error occurred'});
    }
}

//get single project using ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//creating project
const createTask = async (req, res) => {
    try {
        const task = req.body;
        const newTask = new Project(task);
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

//updating Project

const  updateTask= async (req, res) => {
    try {
        const { id } = req.params;
        const task = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Task with id: ${id}`);
        const updatedProject = await Project.findByIdAndUpdate(id, task, { new: true });
        res.status(200).json(updateTask);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

// delete a Project
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllTasks, getTaskById, createProject, updateTask, deleteTask };