import express from 'express';
import rateLimit from 'express-rate-limit';
import { connectDB } from "./models/db.js";
import { setupAdminJS } from "./utils/admin.js";
import { setupRoutes } from "./utils/routes.js";

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    // Setup AdminJS
    const admin = setupAdminJS();

    // Define and configure adminRouter
    const adminRouter = {
      options: {
        rootPath: "/admin",
      },
      admin, // pass the admin object to the router
      // ... other properties and methods
    };

    // Create an Express app
    const app = express();

    // Rate limiter middleware
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    });

    // Use the AdminJS router with rate limiting
    app.use(adminRouter.options.rootPath, limiter, setupRoutes(adminRouter));

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`AdminJS is running at http://localhost:${PORT}/admin`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });