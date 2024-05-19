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
        const task = await Tasks.findById(req.params.idtask).populate("responsible",{username:1});
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// const  getTaskByUser = async (req,res)=> {
//     try {
//         const USER = await User.findById(req.params.id)
//         const task = await Tasks.findById(req.params.idtask).populate("responsible");
//         if (!task) {
//             return res.status(404).json({ error: "Task not found" });
//         }
//         res.json(task);
//     }catch (error){
//     res.status(500).json({error:error.message});
//     }
// }
// const getTaskByUser = async (req, res) => {
//     try {
//         const user = User.findById(req.params.userId);
//        if(!user){
//            return res.status(400).json({ error: "No such user with this ID" });
//        }
//         const task = await Tasks.findById(req.params.idtask)
//             .populate("responsible").where('responsible').equals(req.params.userId);
//         if (!task) {
//             return res.status(404).json({ error: "Task not found" });
//         }
//         res.json(task);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
const getTasksByUser = async (req, res) => {
    try {
        console.log(req.user);
        const userId = req.user.id;
        console.log(`User id: ${userId}`);

        if (!userId) {
            return res.status(400).json({ error: "User ID not found in request" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "No such user with this ID" });
        } else {
            const task = await Tasks.findById(req.params.idtask)
                .populate("responsible")
                .where('responsible').equals(userId);

            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            } else {
                return res.status(200).json(task);
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// const getTasksByUser = async (req, res) => {
//
//         try {
//             const { userId } = req.params;
//             const tasks = await Tasks.find({ responsible: req.user.id }).populate('project').exec();
//             if (!tasks) {
//                 return res.status(404).json({ message: 'No tasks found for this user.' });
//             }
//             res.status(200).json(tasks);
//         } catch (error) {
//             res.status(500).json({ message: 'Server error', error: error.message });
//         }
// };


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
const addUserToTask = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (user) {
            const task = await Tasks.findByIdAndUpdate(req.params.taskId,
                {responsible: req.params.userId},
                {new: true, runValidators: true});
            if (!task) {
                return res.status(404).json({error: "Task not found"});
            } else {
                return res.status(200).json({error: "Task updated successfully"});

            }
        } else {
            return res.status(404).json({error: "User not found"});
        }
    }catch (error){
        return res.status(404).json({error})
    }
};



// const newTask = async (req, res) => {
//     try {
//         const task = await Tasks.create(req.body);
//
//         const PROJECT = await Project.findById(req.params)
//
//         const project = await Project.findByIdAndUpdate(
//             req.params.idproject,
//             { $push: { tasks: task.id } },
//             { new: true }
//         );
//         if (!project) {
//             return res.status(404).send('Project not found');
//         } else {
//             res.status(201).json({ project: project, task: task });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
const newTask = async (req, res) => {
    try {
        const task = await Tasks.create(req.body);

        // Extract project ID from params
        const projectId = req.params.idproject;

        const project = await Project.findByIdAndUpdate(
            projectId, // Use extracted ID directly
            { $push: { tasks: task.id } },
            { new: true }
        );
        if (!project) {
            return res.status(404).send('Project not found');
        } else {
            res.status(201).json({ project: project, task: task });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { getAllTasks, getTaskById, newTask, createTask, updateTask, deleteTask,addUserToTask,getTasksByUser }; //createTask,