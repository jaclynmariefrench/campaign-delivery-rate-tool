const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    passwordHash: { type: String, required: true },
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
}

const User = mongoose.model('User', userSchema);

module.exports = User;