import AdminJS from 'adminjs';
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { Email } from "../models/db.js";
import { Components, componentLoader } from "../adminjs/components.js";
import RatingRule from "../models/ratingSchema.js";

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
              after: async (response) => {
                if (response.record && response.record.errors) {
                  return {
                    ...response,
                    notice: {
                      message: 'Error submitting RatingRule',
                      type: 'error',
                    },
                  };
                }
                return {
                  ...response,
                  notice: {
                    message: 'RatingRule submitted successfully!',
                    type: 'success',
                  },
                };
              },
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
    ],
    rootPath: "/admin",
    options: {
      databaseName: "campaign_delivery_rate_tool",
    },
    componentLoader,
  };

  const admin = new AdminJS(adminJsOptions);
  admin.watch();
  return AdminJSExpress.buildRouter(admin);
};



