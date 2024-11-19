import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/userSchema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret';
const JWT_EXPIRATION = '1h'; // Token valid for 1 hour

export const authenticate = async (email, password) => {
    const user = await User.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            JWT_SECRET, // Secret key
            { expiresIn: JWT_EXPIRATION } // Options
        );

        return { user, token };
    }

    return null; // Authentication failed
};

// Verify JWT token
export const validateToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("Invalid or expired token:", err);
        return null; // Token invalid or expired
    }
};



