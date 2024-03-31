const mongoose = require('mongoose');
const User = require('./userModel');
const Task = require('./taskModel')


const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    dateStart: {type : Date, default: Date.now()},
    dateEnd: Date,
    tasks:   //Tasks are needed here
            [
            {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
            ],
    owner:
            {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
