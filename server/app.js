const express = require('express');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const projectRouter = require('./routes/projectRouter');
const taskRouter = require('./routes/taskRouter'); // Error here
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json()); // Add this line
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/projectRouter', projectRouter);
app.use('/taskRouter', taskRouter); // Error here

module.exports = app;
