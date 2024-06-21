import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Email } from "../models/db.js";
import { calculateDeliverabilityRating } from "/Users/jaclynfrench/workspace/email_project/campaign-delivery-rate-tool/server/ratingCalculator.js";

const { json } = bodyParser;
const app = express();

app.use(json());

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

export const setupRoutes = (adminRouter) => {
    if (!adminRouter || !adminRouter.options || !adminRouter.options.rootPath) {
      throw new Error('Invalid adminRouter configuration');
    }
  
    app.use(adminRouter.options.rootPath, adminRouter.admin);

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
};