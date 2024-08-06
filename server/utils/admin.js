import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { Email } from "../models/emailSchema.js";
import { Components, componentLoader } from "../adminjs/components.js";
import RatingRule from "../models/ratingSchema.js";
import DeliverabilityRating from "../models/deliverabilityRatingSchema.js";
import { buildAdminRouter } from "../auth/authMiddleware.js";

AdminJS.registerAdapter(AdminJSMongoose);

export const setupAdminJS = () => {
  const adminJsOptions = {
    resources: [
      Email,
      {
        resource: RatingRule,
        options: {
          actions: {
            new: {
              actionType: "resource",
              component: Components.RatingRuleForm,
            },
          },
          properties: {
            condition: {
              components: {
                list: Components.ConditionBadge,
                show: Components.ConditionShow,
              },
            },
          },
        },
      },
      {
        resource: DeliverabilityRating,
        options: {
          properties: {
            condition: {
              components: {
                list: Components.ConditionBadge,
                show: Components.ConditionShow,
              },
            },
          },
        },
      },
    ],
    rootPath: "/admin",
    // options: {
    //   databaseName: "campaign_delivery_rate_tool",
    // },
    componentLoader,
  };

  const admin = new AdminJS(adminJsOptions);
  admin.watch();
  return buildAdminRouter(admin);
};
