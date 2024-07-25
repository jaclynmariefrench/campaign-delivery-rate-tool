import mongoose from "mongoose";

const deliverabilityRatingSchema = new mongoose.Schema({
  ratingTerm: { type: String, required: true },
  condition: {
    type: String,
    required: true,
    enum: ['Between', '<', '<=', '>', '>=', '===']
  },
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: false },
  progressBar: { type: Number, required: true},
});

const DeliverabilityRating = mongoose.model(
  "DeliverabilityRating",
  deliverabilityRatingSchema
);

export default DeliverabilityRating;
