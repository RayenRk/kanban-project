const Task = require('../models/taskModel');
const User = require('../models/userModel');

// Fonction pour récupérer toutes les tâches
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Fonction pour récupérer une tâche par son ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.idtask);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Fonction pour créer une nouvelle tâche
const createTask = async (req, res) => {
    try {
        const task = req.body;
        const newTask = new Task(task);
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Fonction pour mettre à jour une tâche
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.idtask, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: 'Task updated successfully', task: task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Fonction pour supprimer une tâche
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.idtask);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Fonction pour affecter une tâche à un utilisateur
const assignTask = async (req, res) => {
    try {
        const taskId = req.params.idtask;
        const userId = req.body.userId;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Mettre à jour la tâche avec l'ID de l'utilisateur responsable
        task.responsible = userId;
        await task.save();

        res.status(200).json({ message: "Task assigned successfully", task: task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask, assignTask };
