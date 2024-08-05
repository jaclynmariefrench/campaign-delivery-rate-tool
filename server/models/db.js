import mongoose from "mongoose";
import { uri } from "../utils/config.js";

export const connectDB = () => {
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};