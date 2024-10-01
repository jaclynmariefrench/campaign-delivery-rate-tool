import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import session from 'express-session';
import { authenticate } from './auth.js';

export const buildAdminRouter = (adminJs) => {
    const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: process.env.COOKIE_SECRET || 'some-secret-password-used-to-secure-cookie',
    }, null, {
        resave: false,
        saveUninitialized: false,
        secret: 'your-secret-key',
        cookie: { secure: false },
    });

    return router;
};
