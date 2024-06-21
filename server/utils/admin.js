import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { Email } from "../models/db.js";

AdminJS.registerAdapter(AdminJSMongoose);

export const setupAdminJS = () => {
  const adminJsOptions = {
    resources: [Email],
    rootPath: "/admin",
    options: {
      databaseName: 'campaign_delivery_rate_tool',
    }
  };

  const admin = new AdminJS(adminJsOptions);
  return AdminJSExpress.buildRouter(admin);
};