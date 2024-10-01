import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Email } from "../models/emailSchema.js";
import { calculateDeliverabilityRating } from "../calculators/ratingCalculator.js";
import { hardcodedCalculateDeliverability } from "../calculators/hardcodedCal.js";

const { json } = bodyParser;

export function setupRoutes(adminRouter) {
  if (!adminRouter || !adminRouter.options || !adminRouter.options.rootPath) {
    throw new Error("Invalid adminRouter configuration");
  }

  const router = express.Router();

  router.use(json());

  router.use(
    cors({
      origin: "http://localhost:8080",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );

  // Use the adminjs router
  router.use(adminRouter.options.rootPath, adminRouter.admin);

  // Testing
  console.log('Router:', router.stack.map(layer => layer.route ? layer.route.path : layer.name));
  router.use((req, res, next) => {
    console.log('Request Path:', req.path);
    next();
  });

  router.get("/", (req, res) => {
    console.log("Received GET request at /");
    res.send("Hello World!");
  });

  router.post("/email-form", async (req, res) => {
    console.log("Received POST request at /email-form");
    const formData = req.body;
    console.log(formData);

    try {
      console.log("Calculating deliverability rating with:", {
        deliveryRate: formData.deliveryRate,
        openRate: formData.openRate,
        clickRate: formData.clickRate,
        unsubscribeRate: formData.unsubscribeRate,
        complaintRate: formData.complaintRate,
      });

      let ratingResult;
      try {
        ratingResult = await calculateDeliverabilityRating(
          formData.deliveryRate,
          formData.openRate,
          formData.clickRate,
          formData.unsubscribeRate,
          formData.complaintRate
        );
      } catch (error) {
        console.error(
          "Primary calculation failed, using fallback logic",
          error
        );
        ratingResult = hardcodedCalculateDeliverability(
          formData.deliveryRate,
          formData.openRate,
          formData.clickRate,
          formData.unsubscribeRate,
          formData.complaintRate
        );
      }

      const { score, deliverabilityRating, progressBar } = ratingResult;

      console.log("Calculated Score:", score);
      console.log("Calculated Deliverability Rating:", deliverabilityRating);
      console.log("Calculated Progress Bar:", progressBar);

      formData.deliverabilityRating = deliverabilityRating;
      formData.score = score;

      const result = await Email.create(formData);
      console.log("Inserted data into MongoDB");

      res.send({
        message: "Form data received",
        deliverabilityRating,
        score,
        progressBar,
        id: result._id,
      });
    } catch (err) {
      console.error("Error inserting data into MongoDB", err);
      res.status(500).send("Error inserting data into MongoDB");
    }
  });

  router.post("/admin/api/resources/RatingRule/actions/new", (req, res) => {
    console.log(
      "Received POST request at /admin/api/resources/RatingRule/actions/new"
    );
    const ratingRuleData = req.body;
    console.log(ratingRuleData);

    RatingRule.create(ratingRuleData)
      .then((result) => {
        console.log("Inserted rating rule into MongoDB");
        res.send({
          message: "Rating rule created",
          id: result._id,
        });
      })
      .catch((err) => {
        console.error("Error inserting rating rule into MongoDB", err);
        res.status(500).send("Error inserting rating rule into MongoDB");
      });
  });

  router.get("/email-form/:id", (req, res) => {
    const id = req.params.id;
    Email.findById(id)
      .then((document) => {
        if (document) {
          res.send(document.deliverabilityRating);
        } else {
          res.status(404).send("No document found with the given ID");
        }
      })
      .catch((err) => {
        console.error("Error fetching document from MongoDB", err);
        res.status(500).send("Error fetching document from MongoDB");
      });
  });

  return router;
}

//10/1/24
// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// // import session from "express-session";
// import { Email } from "../models/emailSchema.js";
// import { calculateDeliverabilityRating } from "../calculators/ratingCalculator.js";
// import { hardcodedCalculateDeliverability } from "../calculators/hardcodedCal.js";


// const { json } = bodyParser;

// export function setupRoutes(adminRouter) {
//   const router = express.Router();

//   router.use(json());

//   router.use(
//     cors({
//       origin: "http://localhost:8080",
//       methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//       credentials: true,
//     })
//   );

//   // //session middleware
//   // router.use(
//   //   session({
//   //     secret: "your-secret-key",
//   //     resave: false,
//   //     saveUninitialized: false,
//   //     cookie: { secure: false },
//   //   })
//   // );

//   // if (!adminRouter || !adminRouter.options || !adminRouter.options.rootPath) {
//   //   throw new Error("Invalid adminRouter configuration");
//   // }

//   //use the adminjs router
//   router.use(adminRouter.options.rootPath, adminRouter.admin);
//   //testing
//   console.log('Router:', router.stack.map(layer => layer.route ? layer.route.path : layer.name));
//   router.use((req, res, next) => {
//     console.log('Request Path:', req.path);
//     next();
//   });
  

//   router.get("/", (req, res) => {
//     console.log("Received GET request at /");
//     res.send("Hello World!");
//   });

//   router.post("/email-form", async (req, res) => {
//     console.log("Received POST request at /email-form");
//     const formData = req.body;
//     console.log(formData);

//     try {
//       console.log("Calculating deliverability rating with:", {
//         deliveryRate: formData.deliveryRate,
//         openRate: formData.openRate,
//         clickRate: formData.clickRate,
//         unsubscribeRate: formData.unsubscribeRate,
//         complaintRate: formData.complaintRate,
//       });

//       let ratingResult;
//       try {
//         ratingResult = await calculateDeliverabilityRating(
//           formData.deliveryRate,
//           formData.openRate,
//           formData.clickRate,
//           formData.unsubscribeRate,
//           formData.complaintRate
//         );
//       } catch (error) {
//         console.error(
//           "Primary calculation failed, using fallback logic",
//           error
//         );
//         ratingResult = hardcodedCalculateDeliverability(
//           formData.deliveryRate,
//           formData.openRate,
//           formData.clickRate,
//           formData.unsubscribeRate,
//           formData.complaintRate
//         );
//       }

//       const { score, deliverabilityRating, progressBar } = ratingResult;

//       console.log("Calculated Score:", score);
//       console.log("Calculated Deliverability Rating:", deliverabilityRating);
//       console.log("Calculated Progress Bar:", progressBar);

//       formData.deliverabilityRating = deliverabilityRating;
//       formData.score = score;

//       const result = await Email.create(formData);
//       console.log("Inserted data into MongoDB");

//       res.send({
//         message: "Form data received",
//         deliverabilityRating,
//         score,
//         progressBar,
//         id: result._id,
//       });
//     } catch (err) {
//       console.error("Error inserting data into MongoDB", err);
//       res.status(500).send("Error inserting data into MongoDB");
//     }
//   });

//   router.post("/admin/api/resources/RatingRule/actions/new", (req, res) => {
//     console.log(
//       "Received POST request at /admin/api/resources/RatingRule/actions/new"
//     );
//     const ratingRuleData = req.body;
//     console.log(ratingRuleData);

//     RatingRule.create(ratingRuleData)
//       .then((result) => {
//         console.log("Inserted rating rule into MongoDB");
//         res.send({
//           message: "Rating rule created",
//           id: result._id,
//         });
//       })
//       .catch((err) => {
//         console.error("Error inserting rating rule into MongoDB", err);
//         res.status(500).send("Error inserting rating rule into MongoDB");
//       });
//   });

//   router.get("/email-form/:id", (req, res) => {
//     const id = req.params.id;
//     Email.findById(id)
//       .then((document) => {
//         if (document) {
//           res.send(document.deliverabilityRating);
//         } else {
//           res.status(404).send("No document found with the given ID");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching document from MongoDB", err);
//         res.status(500).send("Error fetching document from MongoDB");
//       });
//   });

//   return router;
// }
