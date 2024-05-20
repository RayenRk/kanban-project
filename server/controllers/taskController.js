const mongoose = require('mongoose');
const Tasks = require('../models/taskModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

// Get all Tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Tasks.find().lean();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

// Get single Task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Tasks.findById(req.params.idtask).populate("responsible", { username: 1 }).lean();
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Create Task
const createTask = async (req, res) => {
    try {
        const task = new Tasks(req.body);
        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

// Update Task
const updateTask = async (req, res) => {
    try {
        const task = await Tasks.findByIdAndUpdate(req.params.idtask, req.body, { new: true, runValidators: true }).lean();
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete(req.params.idtask).lean();
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Add User to Task
const addUserToTask = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).lean();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const task = await Tasks.findByIdAndUpdate(req.params.taskId, { responsible: req.params.userId }, { new: true, runValidators: true }).lean();
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Create Task and add to Project
const newTask = async (req, res) => {
    try {
        const task = new Tasks(req.body); // Ensure the request body contains all necessary fields
        const project = await Project.findById(req.params.idproject).lean(); // Ensure project ID is valid
        if (!project) {
            return res.status(404).json({ message: 'Project not found' }); // Handle case where project does not exist
        }
        await task.save(); // Ensure task can be saved without validation errors
        res.status(201).json({ message: 'Task created and added to project', project, task });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Send detailed error message in response
    }
}


// Get all Tasks by User
const getAllTasksByUser = async (req, res) => {
    try {
        const tasks = await Tasks.find({ responsible: req.params.userId }).lean();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching tasks.' });
    }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask, addUserToTask, newTask, getAllTasksByUser };
