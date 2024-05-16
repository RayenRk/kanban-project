const User = require('../models/userModel');
const mongoose = require('mongoose');


// CRUD logic for users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ name: user.name, role: user.role }); // Include the user's role in the response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const user = req.body;
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}

// delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };