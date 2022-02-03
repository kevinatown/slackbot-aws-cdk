'use strict';
const serverlessExpress = require('@vendia/serverless-express');
const controller = require('./bot.js');
const server = serverlessExpress.createServer(controller.webserver);

exports.handler = (event, context) => serverlessExpress.proxy(server, event, context);