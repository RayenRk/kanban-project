const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: {type: String, enum: ['todo', 'inprogress', 'done']},
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    responsible: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
