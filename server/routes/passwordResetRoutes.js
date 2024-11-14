import express from "express";
import { User } from "../models/userSchema.js";
import resetPasswordAction from "../adminjs/actions/resetPasswordAction.js"; // Import the resetPasswordAction

const router = express.Router();

// Route for verifying token
router.get("/reset/:token", async (req, res) => {
  console.log("Received request to verify token");
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
  console.log("Received request to reset password");
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

// Route for handling "Forgot Password" request
router.get("/forgot-password", async (req, res) => {
  console.log("Received request for forgot password");
  const email = process.env.ADMIN_EMAIL; // Ensure this environment variable is set
  const context = { resource: User, action: resetPasswordAction };

  try {
    const response = await resetPasswordAction.handler({ payload: { email } }, res, context);
    res.status(200).send(response.message);
  } catch (err) {
    res.status(500).send("Error sending password reset email");
  }
});

export default router;

//without logging
// import express from "express";
// import { User } from "../models/userSchema.js";
// import resetPasswordAction from "../adminjs/actions/resetPasswordAction.js";

// const router = express.Router();

// // Route for verifying token
// router.get("/reset/:token", async (req, res) => {
//   try {
//     const user = await User.findOne({
//       resetPasswordToken: req.params.token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).send("Password reset token is invalid or has expired.");
//     }

//     res.status(200).send("Token is valid. You can reset your password.");
//   } catch (err) {
//     res.status(500).send("Error retrieving user with reset token");
//   }
// });

// // Route for resetting the password
// router.post("/reset/:token", async (req, res) => {
//   try {
//     const user = await User.findOne({
//       resetPasswordToken: req.params.token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).send("Password reset token is invalid or has expired.");
//     }

//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     res.status(200).send("Password has been reset successfully!");
//   } catch (err) {
//     res.status(500).send("Error resetting password");
//   }
// });

// // Route for handling "Forgot Password" request
// router.post("/forgot-password", async (req, res) => {
//   const email = process.env.ADMIN_EMAIL;
//   const context = { resource: User, action: resetPasswordAction };

//   try {
//     const response = await resetPasswordAction.handler({ payload: { email } }, res, context);
//     res.status(200).send(response.message);
//   } catch (err) {
//     res.status(500).send("Error sending password reset email");
//   }
// });

// export default router;
