import bcrypt from 'bcrypt';
import { User } from '../models/userSchema.js';

export const authenticate = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
        return user;
    }
    return null;
}

