const mongoose = require('mongoose');
const Tasks = require('../models/taskModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

//get all Tasks
const getAllTasks = async  (req, res)=>{
    try{
        const  task = await Tasks.find();
        res.status(200).json(task);

    }catch (error){
        res.status(500).json({message: 'An Error occurred'});
    }
}

//get single Task using ID
const getTaskById = async (req, res) => {
    try {
        const task = await Tasks.findById(req.params.idtask);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//creating Task
const createTask = async (req, res) => {
    try {
        // const task = await Tasks.create(req.body);
        const task = req.body;
        const newTask = new Tasks(task);
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

//updating Task

const  updateTask= async (req, res) => {
    try {


        const task = await Tasks.findByIdAndUpdate(req.params.idtask,
            req.body,
            {new :true, runValidators: true});
        if(!task) {
            res.status(404).send(`No Task with id`);
        }{
            res.status(200).send("Task updated successfully")
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

// delete a Task
const deleteTask = async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete(req.params.idtask);
        console.log(req.params.idtask + "xxx");
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




//push task to a project
const newTask = async (req,res) => {
    try{
        const task= await  Tasks.create(req.body);
        console.log(task.id);
        await Project.findByIdAndUpdate(req.params.idproject, {
            $push : {
                Tasks: task.id, //not the id of the params created by mongodb
            },
    });
    console.log("xxx"+ task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllTasks, getTaskById, newTask, createTask, updateTask, deleteTask }; //createTask,
