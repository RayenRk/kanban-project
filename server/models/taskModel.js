const mongoose = require('mongoose');
const User = require('./userModel');
const Project = require('./projectModel');


const status = Object.freeze({
    toDo: 'todo',
    inProgress:'inprogress',
    done:'done',
});

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: {
        type:String,
        enum:Object.values(status),
    },

    project: {type :mongoose.Schema.Types.ObjectId, ref: 'Project'},

    responsible:
        {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
