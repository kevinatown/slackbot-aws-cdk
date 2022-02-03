'use strict';
const fetch = require('node-fetch');
const serverlessExpress = require('@vendia/serverless-express');
const controller = require('./bot.js');
const createBoardBaseUrl = 'https://<fun_retro_location>/newboard?name=';

exports.handler = async (event, context) => {
  const url = `${createBoardBaseUrl}${ new Date().toDateString()} - Mandatory FunRetro`;
  const res = await fetch(url);
  const retroURL = await res.text();
  console.log('recieved retroURL', retroURL);
  await controller.mandatoryFunRetro(retroURL);
  return true;
};
