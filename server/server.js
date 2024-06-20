import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
const { json } = bodyParser;
import cors from "cors";
import mongoose from "mongoose";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { calculateDeliverabilityRating } from "/Users/jaclynfrench/workspace/email_project/campaign-delivery-rate-tool/server/ratingCalculator.js";

AdminJS.registerAdapter(AdminJSMongoose);

const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(json());

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// MongoDB connection string
// MongoDB connection string
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clusteremail.kepffbr.mongodb.net/campaign_delivery_rate_tool?retryWrites=true&w=majority&appName=ClusterEmail`;

// Define Mongoose schema and model
const EmailSchema = new mongoose.Schema({
  campaignName: String,
  deliveryRate: String,
  openRate: String,
  clickRate: String,
  unsubscribeRate: String,
  complaintRate: String,
  deliverabilityRating: String,
});

const Email = mongoose.model("Email", EmailSchema);

// Connect to MongoDB using Mongoose
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // AdminJS setup
    const adminJsOptions = {
      resources: [Email],
      rootPath: "/admin",
      options: {
        databaseName: 'campaign_delivery_rate_tool',
      }
    };

    const admin = new AdminJS(adminJsOptions);

    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);

    app.get("/", (req, res) => {
      console.log("Received GET request at /");
      res.send("Hello World!");
    });

    app.post("/email-form", (req, res) => {
      console.log("Received POST request at /email-form");
      const formData = req.body;
      console.log(formData);

      // Calculate the deliverability rating
      const deliverabilityRating = calculateDeliverabilityRating(
        formData.deliveryRate,
        formData.openRate,
        formData.clickRate,
        formData.unsubscribeRate,
        formData.complaintRate
      );

      // Add the rating to the form data
      formData.deliverabilityRating = deliverabilityRating;

      // Add form data to MongoDB using Mongoose
      console.log("About to insert data into MongoDB");
      Email.create(formData)
        .then((result) => {
          console.log("Inserted data into MongoDB");
          // Send the rating and the inserted document's ID back to the client
          res.send({
            message: "Form data received",
            deliverabilityRating,
            id: result._id,
          });
        })
        .catch((err) => {
          console.error("Error inserting data into MongoDB", err);
          res.status(500).send("Error inserting data into MongoDB");
        });
    });

    app.get("/email-form/:id", (req, res) => {
      const id = req.params.id;
      Email.findById(id)
        .then((document) => {
          if (document) {
            res.send(document.deliverabilityRating);
          } else {
            res.status(404).send("No document found with the given ID");
          }
        })
        .catch((err) => {
          console.error("Error fetching document from MongoDB", err);
          res.status(500).send("Error fetching document from MongoDB");
        });
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });