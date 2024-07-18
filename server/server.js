import { connectDB } from "./models/db.js";
import { setupAdminJS } from "./utils/admin.js";
import { setupRoutes } from "./utils/routes.js";

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
    setupRoutes(adminRouter);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
