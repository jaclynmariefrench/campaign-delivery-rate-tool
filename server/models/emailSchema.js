import mongoose from "mongoose";

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