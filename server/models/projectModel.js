const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    dateStart: {type: Date, default: Date.now()},
    dateEnd: Date,
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
