import express from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User } from "../models/userSchema.js";

const router = express.Router();

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("User not found");
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour window
  await user.save();

  // Create Ethereal email account for testing
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    to: user.email,
    from: testAccount.user,
    subject: "Password Reset",
    text: `Please click on the following link to reset your password: http://${req.headers.host}/reset/${token}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).send("Error sending email");
    }
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    res.status(200).send("Password reset email sent");
  });
});

router.get("/reset/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, // check if token is valid
    });

    if (!user) {
      return res.status(400).send("Password reset token is invalid or has expired.");
    }

    res.status(200).send("Token is valid. You can reset your password.");
  } catch (err) {
    res.status(500).send("Error retrieving user with reset token");
  }
});

router.post("/reset/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, // check if token is valid
    });

    if (!user) {
      return res.status(400).send("Password reset token is invalid or has expired.");
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiry date

    await user.save();

    res.status(200).send("Password has been reset successfully!");
  } catch (err) {
    res.status(500).send("Error resetting password");
  }
});

export default router;