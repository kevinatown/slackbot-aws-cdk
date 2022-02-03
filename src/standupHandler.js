'use strict';
const serverlessExpress = require('@vendia/serverless-express');
const controller = require('./bot.js');

exports.handler = async (event, context) => {
  await controller.standupReminder();
  return true;
};
