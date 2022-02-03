const { Botkit } = require('botkit');
const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack');
const { addToBotTable, getFromBotTable } = require('./storage');
const { sampleArray } = require('./utils/functions');
const { CHANNELS, ALLNAMECODES, CODE2NAME } = require('./utils/constants');

// Load process.env values from .env file
require('dotenv').config();

let storage = null;

const getTokenForTeam = async (teamId) => {
  try {
    const { body, statusCode } = await getFromBotTable(teamId);

    if (statusCode === 500 || !body) {
      console.error(body);
      return body;
    }
    const { token } = body;
    return token;

  } catch (error) {
    console.error(error);
  }
}

const getBotUserByTeam = async (teamId) => {
  try {
    const { body, statusCode } = await getFromBotTable(teamId);

    if (statusCode === 500 || !body) {
      console.error(body);
      return body;
    }
    const { bot_user_id } = body;
    return bot_user_id;

  } catch (error) {
    console.error(error);
  }
}

const adapter = new SlackAdapter({
  // REMOVE THIS OPTION AFTER APP IS CONFIGURED!
  enable_incomplete: true,

  // parameters used to secure webhook endpoint
  verificationToken: process.env.verificationToken,
  clientSigningSecret: process.env.clientSigningSecret,  

  // auth token for a single-team app
  botToken: process.env.botToken,

  // credentials used to set up oauth for multi-team apps
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ['bot'], 
  redirectUri: process.env.redirectUri,

  // These are techincally not needed but botkit complains if theyre not here
  getTokenForTeam,
  getBotUserByTeam,
});

// Get events and and what not to look like slack/old 
adapter.use(new SlackEventMiddleware());
adapter.use(new SlackMessageTypeMiddleware());

const controller = new Botkit({
  webhook_uri: '/api/messages',
  adapter,
  storage
});

controller.ready(() => {
  console.log('controller ready');
  controller.loadModules(__dirname + '/features');
  console.log('controller Modules loaded');
});

controller.webserver.get('/', (req, res) => {
  console.log('got to /');
  res.send(`This app is running Botkit ${ controller.version }.`);
});

controller.webserver.get('/install', (req, res) => {
  // getInstallLink points to slack's oauth endpoint and includes clientId and sc
  console.log('got to install');
  res.redirect(controller.adapter.getInstallLink());
});

controller.webserver.get('/install/auth', async (req, res) => {
  try {
    console.log('attempting auth', req)
    const results = await controller.adapter.validateOauthCode(req.query.code);
    console.log('FULL OAUTH DETAILS', results);

    if (results && results.bot) {
      const { access_token, user_id, team_id, bot } = results;
      const { bot_access_token, bot_user_id } = bot;
      console.log({
        bot_access_token, access_token, user_id, team_id, bot_user_id
      })
      await addToBotTable(results.team_id,
      { 
        token: bot_access_token,
        user_token: access_token,
        user_id,
        bot_user_id
      });
      console.log('Added to bot table');


      res.json('Success! Bot installed.');
    } else {
      console.warn('whoops, seems like somthing happend')
    }

  } catch (err) {
    console.error('OAUTH ERROR:', err);
    res.status(401);
    res.send(err.message);
  }
});

controller.mandatoryFunRetro = async (retroUrl) => {
  // CHANGE ME
  const channel = CHANNELS.general;

  // TODO: figure out a better way than hardcoding the team
  const bot = await controller.spawn('TQ9JHK6J1');
  await bot.api.chat.postMessage({
    channel,
    unfurl_media: true,
    unfurl_links: true,
    token: process.env.botToken,
    text: `<!here> It's now time for *mandatory* *_FUN_*\u000bretro, please put in some cards here: ${retroUrl}`
  });

  // TODO: do look up of individuals, kinda like so:
  // 
  // await bot.api.conversations.members({
  //       channel: message.channel,
  //       token: process.env.slackToken
  //     }, async (err,response) => {      
  //       const members = response.members;
  //       // remove the bot
  //       _.pull(members, 'U011CDSB32P');    
  //       const newBannedUser = _.sample(members);

  await new Promise((resolve) => {
    setTimeout(async () => {
      const loser = sampleArray(ALLNAMECODES);
      await bot.api.chat.postMessage({
        channel,
        unfurl_media: true,
        unfurl_links: true,
        token: process.env.botToken,
        text: `<@${loser}> You haven't filled out the *_mandatoy_* *_FUN_*\u000bretro cards please do it now! ${retroUrl}`
      });
      resolve();
    }, 300000);
  });
};

controller.standupReminder = async () => {
  // CHANGE ME
  const channel = CHANNELS.general;

  // TODO: figure out a better way than hardcoding the team
  const bot = await controller.spawn('TQ9JHK6J1');
  const loser = sampleArray(ALLNAMECODES);
  const mod = CODE2NAME[loser] === 'John Mahoney' ? 100 : 500;
  const loserMissedStandup = Math.floor(Math.random() * 10000) % mod === 0;
  if (loserMissedStandup) {
    console.log(`${CODE2NAME[loser]} missed standup`);
    await bot.api.chat.postMessage({
      channel,
      unfurl_media: true,
      unfurl_links: true,
      token: process.env.botToken,
      text: `<@${loser}>, we missed you in stand up, please share your updates.`
    });
  }
};

module.exports = controller;
