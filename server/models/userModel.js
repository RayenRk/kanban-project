const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique:true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    }
});

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    next();
  });

const User = mongoose.model('User', userSchema);

module.exports = User;