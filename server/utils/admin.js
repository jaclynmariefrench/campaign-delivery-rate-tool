import AdminJS, { actions } from "adminjs";
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
              actionType: 'resource',
              component: Components.RatingRuleForm,
              handler: async (context) => {
                return {
                  redirectUrl: context.h.resourceActionUrl({
                    resourceId: context.resource.id(),
                    actionName: 'ratingRuleForm',
                  })
                }
              }
            }
          },
          properties: {
            condition: {
              components: {
                list: Components.ConditionBadge,
                show: Components.ConditionShow,
              }
            }
          }
        }
      },
    ],
    rootPath: "/admin",
    options: {
      databaseName: "campaign_delivery_rate_tool",
    },
    pages: {
      customRatingRuleForm: {
        label: "Custom Rating Rule",
        component: Components.RatingRuleForm,
      }
    },
    componentLoader,
  };

  const admin = new AdminJS(adminJsOptions);
  admin.watch();
  return AdminJSExpress.buildRouter(admin);
};
