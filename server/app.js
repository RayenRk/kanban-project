const express = require('express');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const projectRouter = require('./routes/projectRouter');
const taskRouter = require('./routes/taskRouter'); //error her
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
    app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/projectRouter',projectRouter);
app.use('/taskRouter',taskRouter); //error here


module.exports = app;