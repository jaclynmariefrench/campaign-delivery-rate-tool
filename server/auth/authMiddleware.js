const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const { authenticate } = require('./auth');

const buildAdminRouter = (adminJs) => {
    return AdminJSExpress.buildAuthenticatedRouter(adminJs, {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: process.env.COOKIE_SECRET || 'some-secret-password-used-to-secure-cookie',
    })
}

module.exports = { buildAdminRouter };