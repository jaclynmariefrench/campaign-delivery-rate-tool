import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passwordResetRoutes from "./passwordResetRoutes.js";
import emailRoutes from "./emailRoutes.js";

const { json } = bodyParser;

export function setupRoutes() {
  const router = express.Router();

  // Apply bodyParser middleware
  router.use(json());

  // CORS middleware
  router.use(
    cors({
      origin: "http://localhost:8080",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );

  // Testing log
  console.log(
    "Router:",
    router.stack.map((layer) => (layer.route ? layer.route.path : layer.name))
  );

  router.use((req, res, next) => {
    console.log("Request Path:", req.path);
    next();
  });

  // Use separate route files
  router.use(emailRoutes);
  router.use(passwordResetRoutes);

  // Root route
  router.get("/", (req, res) => {
    console.log("Received GET request at /");
    res.send("Hello World!");
  });

  return router;
}