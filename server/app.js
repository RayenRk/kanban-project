const express = require('express');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/auth/', authRouter);
app.use('/api/user/', userRouter);

module.exports = app;