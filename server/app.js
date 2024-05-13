const express = require('express');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const projectRouter = require('./routes/projectRouter');
const taskRouter = require('./routes/taskRouter'); // Assuming it's defined
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter); // Assuming project routes start with /project
app.use('/api/task', taskRouter); // Mount taskRouter under /api/task

// Optional error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(err.statusCode || 500).send({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
