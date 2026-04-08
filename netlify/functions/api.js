const serverless = require('serverless-http');
const app = require('../../server/index');

// Netlify serverless execution wrapper
module.exports.handler = serverless(app);
