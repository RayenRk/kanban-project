const mongoose = require('mongoose');

const status = Object.freeze({
    toDo: 'todo',
    inProgress:'inprogress',
    done:'done',
});

const taskSchema = new mongoose.schema({
    name: String,
    description: String,
    Status: {
        type:String,
        enum:Object.values(status),
    },

    responsible:
        {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})