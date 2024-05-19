const jwt = require('jsonwebtoken');
const USER = require('../models/userModel')
const dotenv = require('dotenv');
dotenv.config();

// Middleware function to authenticate requests
// const authenticate = async (req, res, next) => {
//     // Get the token from the request headers
//     const token = req.headers.authorization;
//     // Check if token exists
//     if (!token) {
//         return res.status(401).json({message: 'No token provided'});
//     }
//     try {
//         // Verify the token
//         const tokenData = req.headers.authorization;
//         if(!tokenData){
//             return res.status(401).json({message: 'Not connected'});
//         }
//         const decoded = jwt.verify(tokenData, process.env.SECRET_KEY);
//
//         // Attach the decoded user information to the request object
//
//         // const currentUser = await USER.findById(decoded.id);
//         req.user=JSON.stringify(decoded);
//        // console.log(req.user + "zzzzzzzzzzzzzz")
//         // Call the next middleware
//         next();
//     } catch (error) {
//         return res.status(401).json({message: 'Invalid token'});
//     }
// };

const authenticate = async (req, res, next) => {
    // Get the token from the request headers
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Extract the token (assuming the format is "Bearer <token>")
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token not provided in the correct format' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Call the next middleware
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
const authorizeAll = async (req, res, next) => {
    const allowedRoles = ['admin', 'po', 'user']; // List of allowed roles
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'You are not authorized' });
    }

    next();
};
const authorizeAdminPo = async (req, res, next) => {
    const allowedRoles = ['admin', 'po']; // List of allowed roles
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'You are not authorized' });
    }

    next();
};



// const authorize = async (req, res, next) => {
//     const { role } = req.user;
//     const authorizedRoles = ['admin', 'po']; // Define allowed roles here
//
//     if (!authorizedRoles.includes(role)) {
//         return res.status(403).json({ message: 'You are not authorized' });
//     }
//
//     next();
// };

module.exports = { authenticate, authorize,authorizeAll,authorizeAdminPo };