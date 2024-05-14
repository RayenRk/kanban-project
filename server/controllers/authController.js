const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register a user
const register = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        // Check if the username exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        } else {
            // Check if the email exists
            const existingEmail = await User.findOne ({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            } else {
                // Create a new user
                const user = new User({ username, password, email, role });
                await user.save();

                res.status(201).json({ message: 'User created successfully' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

// Login a user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne ({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        } else {
            // Check if the password is correct
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid username or password' });
            } else {
                // Create a JWT token
                const token = jwt.sign({ username: user.username, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
                
                // Attach the token to the response header
                res.setHeader('Authorization', token); // set the token in the response header

                // Send the token in a variable in the response body
                res.json({ token, username: user.username, role: user.role });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}


// Logout a user
const logout = (req, res) => {
    try {
        // logout the user with JWT token by setting the token to an empty string in the response header
        res.setHeader('Authorization', '');

        // end session with jwt token
        res.clearCookie('token');
        res.session = null;

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

module.exports = { register, login, logout };