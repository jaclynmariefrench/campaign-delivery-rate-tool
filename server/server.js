import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { connectDB } from "./models/db.js";
import { setupAdminJS } from "./utils/admin.js";
import { setupRoutes } from "./utils/routes.js";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    // Setup AdminJS
    const adminRouter = setupAdminJS(); // This now includes authentication

    // Create an Express app
    const app = express();

    //session middleware
    app.use(
      session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
      })
    );

    //testing
    console.log("AdminJS Router", adminRouter);

    // testing session middleware
    app.use((req, res, next) => {
      console.log("Session Middleware:", req.session);
      next();
    });

    // Rate limiter middleware
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    });

    // Apply rate limiter and route setup
    app.use(
      adminRouter.options.rootPath,
      limiter,
      (req, res, next) => {
        console.log("Incoming Request to AdminJS:", req.method, req.url);
        next();
      },
      setupRoutes(adminRouter)
    );

    // Log route setup
    app.use((req, res, next) => {
      console.log("Route Path:", req.path);
      next();
    });

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
