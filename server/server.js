import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import bodyParser from "body-parser";
import { connectDB } from "./models/db.js";
import { setupAdminJS } from "./utils/admin.js";
import { setupRoutes } from "./routes/index.js";
import passwordResetRoutes from "./routes/passwordResetRoutes.js"; // Import the password reset routes
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    // Setup AdminJS
    const adminRouter = setupAdminJS();
    console.log("AdminJS router set up:");

    // Create an Express app
    const app = express();

    // Session middleware
    app.use(
      session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
      })
    );

    // Apply rate limiter middleware
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    });
    app.use(limiter);

    // Apply body-parser middleware
    app.use(bodyParser.json());

    // Serve static files
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.static(path.join(__dirname, "static"))); // Serve static files from the static directory

    // Setup password reset routes before AdminJS router
    app.use("/admin", passwordResetRoutes);

    // Apply AdminJS router
    app.use(adminRouter.options.rootPath, adminRouter);

    // Setup other routes
    const routes = setupRoutes();
    console.log("Setting up other routes");
    app.use(routes);

    // Log route setup
    app.use((req, res, next) => {
      console.log("Route Path:", req.path);
      next();
    });

    // Log all requests
    app.use((req, res, next) => {
      console.log(`Received request: ${req.method} ${req.path}`);
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


