const User = require('../models/userSchema');

const authenticate = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && await user.comparePassword(password)) {
        return { email: user.email };
    }
    return null;
}

module.exports = { authenticate };