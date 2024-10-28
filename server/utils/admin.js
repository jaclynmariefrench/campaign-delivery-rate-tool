import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { Email } from "../models/emailSchema.js";
import { Components, componentLoader } from "../adminjs/components.js";
import RatingRule from "../models/ratingSchema.js";
import DeliverabilityRating from "../models/deliverabilityRatingSchema.js";
import {User} from "../models/userSchema.js";
import { buildAdminRouter } from "../auth/authMiddleware.js";
import resetPasswordAction from "../adminjs/actions/resetPasswordAction.js";


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
      {
        resource: User, // Add the User resource
        options: {
          actions: {
            resetPassword: resetPasswordAction, // Add custom action here
          },
        },
      },
    ],
    branding: {
      companyName: 'Travis',
      softwareBrothers: false,
      // logo: '/path/to/logo', // Or an HTML link that redirects to your custom page
      theme: {
        colors: { primary100: '#0d6efd' },
      },
      footer: 'Need help? <a href="/admin/reset-password">Forgot Password?</a>',
    },
    rootPath: "/admin",
    componentLoader,
    
  };

  const admin = new AdminJS(adminJsOptions);
  admin.overrideLogin({ component: Components.CustomLogin});
  admin.watch();

  const adminRouter = buildAdminRouter(admin);

  return adminRouter;
};
