const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware function to authenticate requests
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    console.log('Authorization header:', token); // Debugging line

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const tokenData = token.split(" ")[1];
        const decoded = jwt.verify(tokenData, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};


const authorize = async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized' });
    }
    next();
};

module.exports = { authenticate, authorize };