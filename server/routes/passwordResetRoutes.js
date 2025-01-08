import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userSchema.js";
import resetPasswordAction from "../adminjs/actions/resetPasswordAction.js"; // Import the resetPasswordAction
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import rateLimit from "express-rate-limit";

//defining dirname for static serve
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min window
  max: 5,
  message: "Too many password attempts from this IP. Try again later.",
  headers: true,
  handler: (req, res) => {
    res
      .status(429)
      .json({
        success: false,
        message:
          "Too many password request attempts from this IP. Try again later.",
      });
  },
});

//route for serving the email password input form
router.get("/forgot-password", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../static/EmailPasswordResetForm.html"
  );
  res.sendFile(filePath);
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
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
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
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
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

router.post("/reset-password", resetPasswordLimiter, async (req, res) => {
  const { email } = req.body;
  console.log("Received forgot password request for email:", email);

  try {
    await resetPasswordAction.handler(req, res);
  } catch (error) {
    console.error("Error handling forgot password request:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export default router;
