const mongoose = require("mongoose");
const Tasks = require("../models/taskModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");

//get all Tasks
const getAllTasks = async (req, res) => {
  try {
    const task = await Tasks.find();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "An Error occurred" });
  }
};

//get single Task using ID
const getTaskById = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.idtask).populate(
      "responsible",
      { username: 1 }
    );
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//creating Task
const createTask = async (req, res) => {
  try {
    // const task = await Tasks.create(req.body);
    const task = req.body;
    const newTask = new Tasks(task);
    await newTask.save();
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

//updating Task

const updateTask = async (req, res) => {
  try {
    const task = await Tasks.findByIdAndUpdate(req.params.idtask, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      res.status(404).send(`No Task with id`);
    }
    {
      res.status(200).send("Task updated successfully");
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

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
};
const addUserToTask = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      const task = await Tasks.findByIdAndUpdate(
        req.params.taskId,
        { responsible: req.params.userId },
        { new: true, runValidators: true }
      );
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      } else {
        return res.status(200).json({ error: "Task updated successfully" });
      }
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
};

const newTask = async (req, res) => {
  // create a new task with current user id as the responsible field and the status depending on the html div id
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const task = await Tasks.create({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      // project: req.body.idproject,
      responsible: user._id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const newTaskWithProject = async (req, res) => {
  // create a new task with the current user ID as the responsible field and the status depending on the HTML div ID
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const task = await Tasks.create({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      responsible: user._id,
      project: project._id, // Associate task with the project
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTasksByUser = async (req, res) => {
  try {
    // Retrieve the user ID from the request parameters
    const { userId } = req.params;

    // Query the database for tasks associated with the user ID
    const tasks = await Tasks.find({ responsible: userId });

    // Return the tasks in the response
    res.status(200).json(tasks);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching tasks." });
  }
};

const getAllTasksByUserAndProject = async (req, res) => {
  try {
    // Retrieve the user ID and project ID from the request parameters
    const { projectId, userId } = req.params;

    // Query the database for tasks associated with the user ID and project ID
    const tasks = await Tasks.find({ project: projectId, responsible: userId });

    // Return the tasks in the response
    res.status(200).json(tasks);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching tasks." });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  newTask,
  createTask,
  updateTask,
  deleteTask,
  addUserToTask,
  getAllTasksByUser,
  getAllTasksByUserAndProject,
  newTaskWithProject,
}; //createTask,
