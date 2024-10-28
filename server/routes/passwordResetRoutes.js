import express from "express";
import { User } from "../models/userSchema.js";

const router = express.Router();

// Route for verifying token
router.get("/reset/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Password reset token is invalid or has expired.");
    }

    res.status(200).send("Token is valid. You can reset your password.");
  } catch (err) {
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
      return res.status(400).send("Password reset token is invalid or has expired.");
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).send("Password has been reset successfully!");
  } catch (err) {
    res.status(500).send("Error resetting password");
  }
});

export default router;
