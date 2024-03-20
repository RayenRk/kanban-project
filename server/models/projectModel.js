const mongoose = require('mongoose');

const projectSchema = new mongoose.schema({
    name: String,
    description: String,
    dateStart: Date,
    dateEnd: Date,
    tasks:
            [
            {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
            ],
    owner:
            {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})

const Project = mongoose.model('Project', userSchema);

module.exports = Project;