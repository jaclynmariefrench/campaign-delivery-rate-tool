import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userSchema.js";
import resetPasswordAction from "../adminjs/actions/resetPasswordAction.js"; // Import the resetPasswordAction
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from 'path';
import rateLimit from "express-rate-limit";

//defining dirname for static serve
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min window
  max: 5,
  message: 'Too many password attempts from this IP. Try again later.',
  headers: true,
});

// Route for verifying token and serving the reset password form
router.get("/reset/:token", async (req, res) => {
  console.log("Received request to verify token:", req.params.token);
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token is invalid or has expired");
      return res.status(400).send("Password reset token is invalid or has expired.");
    }

    console.log("Token is valid, serving reset password form");

    // Serve the reset password form with the token as a query parameter
    const filePath = path.join(__dirname, "../static/resetPasswordForm.html");
    console.log("Serving file:", filePath);
    res.sendFile(filePath);
  } catch (err) {
    console.error("Error retrieving user with reset token:", err);
    res.status(500).send("Error retrieving user with reset token");
  }
});

// Route for resetting the password
router.post("/reset/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token is invalid or has expired");
      return res.status(400).send("Password reset token is invalid or has expired.");
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Update user with the new password and clear the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).send("Password has been reset successfully!");
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).send("Error resetting password");
  }
});

// Route for handling "Forgot Password" request
router.get("/forgot-password", resetPasswordLimiter, async (req, res) => {
  console.log("Received request for forgot password");
  const email = process.env.ADMIN_EMAIL; // Ensure this environment variable is set
  const context = { resource: User, action: resetPasswordAction };

  try {
    const response = await resetPasswordAction.handler({ payload: { email } }, res, context);
    res.status(200).send(response.message);
  } catch (err) {
    console.error("Error sending password reset email:", err);
    res.status(500).send("Error sending password reset email");
  }
});

export default router;


