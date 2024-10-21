import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Email } from "../models/emailSchema.js";
import { User } from "../models/userSchema.js";
import { calculateDeliverabilityRating } from "../calculators/ratingCalculator.js";
import { hardcodedCalculateDeliverability } from "../calculators/hardcodedCal.js";

const { json } = bodyParser;

export function setupRoutes() {
  const router = express.Router();

  // Apply bodyParser middleware
  router.use(json());

  // CORS middleware
  router.use(
    cors({
      origin: "http://localhost:8080",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );

  // Testing log
  console.log(
    "Router:",
    router.stack.map((layer) => (layer.route ? layer.route.path : layer.name))
  );

  router.use((req, res, next) => {
    console.log("Request Path:", req.path);
    next();
  });

  // Route Handlers
  router.get("/", (req, res) => {
    console.log("Received GET request at /");
    res.send("Hello World!");
  });

  router.post("/email-form", async (req, res) => {
    console.log("Received POST request at /email-form");
    const formData = req.body;
    console.log(formData);

    try {
      let ratingResult;
      try {
        ratingResult = await calculateDeliverabilityRating(
          formData.deliveryRate,
          formData.openRate,
          formData.clickRate,
          formData.unsubscribeRate,
          formData.complaintRate
        );
      } catch (error) {
        console.error("Primary calculation failed, using fallback logic", error);
        ratingResult = hardcodedCalculateDeliverability(
          formData.deliveryRate,
          formData.openRate,
          formData.clickRate,
          formData.unsubscribeRate,
          formData.complaintRate
        );
      }

      const { score, deliverabilityRating, progressBar } = ratingResult;

      formData.deliverabilityRating = deliverabilityRating;
      formData.score = score;

      const result = await Email.create(formData);
      console.log("Inserted data into MongoDB");

      res.send({
        message: "Form data received",
        deliverabilityRating,
        score,
        progressBar,
        id: result._id,
      });
    } catch (err) {
      console.error("Error inserting data into MongoDB", err);
      res.status(500).send("Error inserting data into MongoDB");
    }
  });

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

    // Route to validate reset token and show the reset form (GET request)
    router.get("/reset/:token", async (req, res) => {
      try {
        const user = await User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { $gt: Date.now() }, // check if token is valid
        });
  
        if (!user) {
          return res.status(400).send("Password reset token is invalid or has expired.");
        }
  
        // If token is valid, proceed to show a form or just return a message for now
        res.status(200).send("Token is valid. You can reset your password.");
      } catch (err) {
        res.status(500).send("Error retrieving user with reset token");
      }
    });
  
    // Route to handle the password reset form submission (POST request)
    router.post("/reset/:token", async (req, res) => {
      try {
        const user = await User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { $gt: Date.now() }, // check if token is valid
        });
  
        if (!user) {
          return res.status(400).send("Password reset token is invalid or has expired.");
        }
  
        // Set the new password (you might want to hash this password here)
        user.password = req.body.password;
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined; // Clear the expiry date
  
        await user.save();
  
        res.status(200).send("Password has been reset successfully!");
      } catch (err) {
        res.status(500).send("Error resetting password");
      }
    });

  return router;
}


