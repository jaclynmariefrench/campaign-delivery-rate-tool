import dotenv from "dotenv";

dotenv.config();

export const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clusteremail.kepffbr.mongodb.net/campaign_delivery_rate_tool?retryWrites=true&w=majority&appName=ClusterEmail`;