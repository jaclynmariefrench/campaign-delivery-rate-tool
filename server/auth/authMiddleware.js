import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import session from 'express-session';
import { authenticate, validateToken } from './auth.js';

export const buildAdminRouter = (adminJs) => {
    console.log("building adminjs router");

    const router = AdminJSExpress.buildAuthenticatedRouter(
        adminJs,
        {
            // Custom authentication logic
            authenticate: async (email, password) => {
                const result = await authenticate(email, password);

                if (result) {
                    const { user, token } = result;

                    // Store token in session for AdminJS
                    session.token = token;

                    return user; // AdminJS expects the user object
                }

                return null; // Authentication failed
            },
            cookieName: 'adminjs',
            cookiePassword: process.env.COOKIE_SECRET || 'some-secret-password-used-to-secure-cookie',
        },
        null,
        {
            resave: false,
            saveUninitialized: false,
            secret: 'your-secret-key',
            cookie: { secure: false },
        }
    );

    // Add middleware to validate JWT on subsequent requests
    router.use((req, res, next) => {
        const token = session.token;

        if (token) {
            const decoded = validateToken(token);

            if (decoded) {
                req.user = decoded; // Attach user info to the request
                return next();
            }

            console.error("Invalid or expired token");
        }

        res.status(401).send("Unauthorized: Invalid or missing token");
    });

    router.options = adminJs.options;

    console.log("adminjs router built:");
    return router;
};

