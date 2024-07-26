import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Email } from "../models/db.js";
// import { RatingRule } from "../models/ratingSchema.js";
import { calculateDeliverabilityRating } from "../calculators/ratingCalculator.js";
import { hardcodedCalculateDeliverability } from "../calculators/hardcodedCal.js";

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
    throw new Error("Invalid adminRouter configuration");
  }

  app.use(adminRouter.options.rootPath, adminRouter.admin);

  app.get("/", (req, res) => {
    console.log("Received GET request at /");
    res.send("Hello World!");
  });

  app.post("/email-form", async (req, res) => {
    console.log("Received POST request at /email-form");
    const formData = req.body;
    console.log(formData);

    try {
      // Log input parameters
      console.log("Calculating deliverability rating with:", {
        deliveryRate: formData.deliveryRate,
        openRate: formData.openRate,
        clickRate: formData.clickRate,
        unsubscribeRate: formData.unsubscribeRate,
        complaintRate: formData.complaintRate,
      });
      
      // Calculate the deliverability rating
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
        console.error(
          "Primary calculation failed, using fallback logic",
          error
        );
        ratingResult = hardcodedCalculateDeliverability(
          formData.deliveryRate,
          formData.openRate,
          formData.clickRate,
          formData.unsubscribeRate,
          formData.complaintRate
        );
      }

      const { score, deliverabilityRating, progressBar } = ratingResult;

      // Log the calculated values
      console.log("Calculated Score:", score);
      console.log("Calculated Deliverability Rating:", deliverabilityRating);
      console.log("Calculated Progress Bar:", progressBar);

      // Add the rating to the form data
      formData.deliverabilityRating = deliverabilityRating;
      formData.score = score;

      // Add form data to MongoDB using Mongoose
      console.log("About to insert data into MongoDB");
      const result = await Email.create(formData);
      console.log("Inserted data into MongoDB");

      // Send the rating and the inserted document's ID back to the client
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

  // Rating rule calls
  app.post("/admin/api/resources/RatingRule/actions/new", (req, res) => {
    console.log(
      "Received POST request at /admin/api/resources/RatingRule/actions/new"
    );
    const ratingRuleData = req.body;
    console.log(ratingRuleData);

    // Add rating rule data to MongoDB using Mongoose
    RatingRule.create(ratingRuleData)
      .then((result) => {
        console.log("Inserted rating rule into MongoDB");
        res.send({
          message: "Rating rule created",
          id: result._id,
        });
      })
      .catch((err) => {
        console.error("Error inserting rating rule into MongoDB", err);
        res.status(500).send("Error inserting rating rule into MongoDB");
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
