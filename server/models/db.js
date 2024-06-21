import mongoose from "mongoose";
import { uri } from "../utils/config.js";

const EmailSchema = new mongoose.Schema({
  campaignName: String,
  deliveryRate: String,
  openRate: String,
  clickRate: String,
  unsubscribeRate: String,
  complaintRate: String,
  deliverabilityRating: String,
});

export const Email = mongoose.model("Email", EmailSchema);

export const connectDB = () => {
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};