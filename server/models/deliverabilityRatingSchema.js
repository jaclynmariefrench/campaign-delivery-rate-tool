import mongoose from "mongoose";

const deliverabilityRatingSchema = new mongoose.Schema({
  ratingTerm: { type: String, required: true },
  score: { type: Number, required: true },
});

const DeliverabilityRating = mongoose.model(
  "DeliverabilityRating",
  deliverabilityRatingSchema
);

export default DeliverabilityRating;
