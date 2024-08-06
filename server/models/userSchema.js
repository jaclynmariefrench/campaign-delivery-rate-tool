import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);