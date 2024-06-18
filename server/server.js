import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
const { json } = bodyParser;
import cors from "cors";
import { MongoClient } from "mongodb";


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
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clusteremail.kepffbr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterEmail`;


let db;

// Connect to MongoDB
MongoClient.connect(uri)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db('campaign_delivery_rate_tool'); // Get reference to the database

    app.get("/", (req, res) => {
      console.log("Received GET request at /"); // New log statement
      res.send("Hello World!");
    });
    
    app.post("/email-form", (req, res) => {
      console.log("Received POST request at /email-form"); // New log statement
      const formData = req.body;
      console.log(formData);
      // Add form data to MongoDB
      console.log("About to insert data into MongoDB"); // New log statement
      db.collection("emails")
        .insertOne(formData)
        .then((result) => {
          console.log("Inserted data into MongoDB"); // New log statement
          res.send("Form data received");
        })
        .catch((err) => {
          console.error("Error inserting data into MongoDB", err);
          res.status(500).send("Error inserting data into MongoDB");
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
