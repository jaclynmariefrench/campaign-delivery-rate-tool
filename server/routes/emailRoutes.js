import express from "express";
import { Email } from "../models/emailSchema.js";
import { calculateDeliverabilityRating } from "../calculators/ratingCalculator.js";
import { hardcodedCalculateDeliverability } from "../calculators/hardcodedCal.js";

const router = express.Router();

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

export default router;