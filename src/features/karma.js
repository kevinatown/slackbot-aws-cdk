const { addKarma, removeKarma, getCurrentKarma, getAllUsers, formatUsersKarma } = require('../utils/karma-helpers.js')
const { BOT_USER } = require('../utils/constants'); 

module.exports = function(controller) {
  
  controller.hears([new RegExp(/(<@[A-Z0-9]*>)\s?\+\+/)], 'direct_message,direct_mention,ambient,mention', async function(bot, message) {
    if (message.match[1]) {
      const user = message.match[1].slice(2,-1);
      if (user !== message.user) {
        await addKarma(user, controller);
        const currKarma = await getCurrentKarma(user, controller);
        bot.reply(message, `${message.match[1]}'s karma is now at ${currKarma}`);
      } else {
        await removeKarma(user, controller);
        const currKarma = await getCurrentKarma(user, controller);
        bot.reply(message, `${message.match[1]}'s karma is now at ${currKarma}`);
      }
    }
  });
  
  controller.hears([new RegExp(/(<@[A-Z0-9]*>)\s?\-\-/)], 'direct_message,direct_mention,ambient,mention', async function(bot, message) {
    if (message.match[1]) {
      const user = message.match[1].slice(2,-1);
      const mUser  = message.user;
      const isBot = user === BOT_USER;
      if (isBot) {
        await removeKarma(mUser, controller);
      } else {
        await removeKarma(user, controller);
      }
      const currKarma = await getCurrentKarma(isBot ? mUser : user, controller);
      bot.reply(message, `${isBot ? `<@${mUser}>` : message.match[1]}'s karma is now at ${currKarma}`);
    }
  });
  
  controller.hears([new RegExp(/\-\-/)], 'direct_message,direct_mention,mention', async function(bot, message) {
    if (message.match) {
      const user  = message.user;
      await removeKarma(BOT_USER, controller);
      await removeKarma(user, controller);
      const currBotKarma = await getCurrentKarma(BOT_USER, controller);
      const currUserKarma = await getCurrentKarma(user, controller);
      const reply = `<@${BOT_USER}>'s karma is now at ${currBotKarma}\n<@${user}>'s karma is now at ${currUserKarma}`;
      bot.reply(message, reply);
    }
  });
  
  controller.hears(['karma', 'karma count'], 'direct_message,direct_mention,mention', async function(bot, message) {
    if (message.match) {
      const users = await getAllUsers(controller);
      const { lines, roomKarma } = formatUsersKarma(users);
      bot.api.chat.postMessage({
        channel: message.channel,
        text: `${lines}`,
        ts: message.ts,
        unfurl_media: true,
        unfurl_links: true,
        token: process.env.slackToken,
        icon_url: roomKarma > 0 ? 
          'http://cdn.ebaumsworld.com/mediaFiles/picture/2235368/83886184.jpg' :
          'https://i.redd.it/apzz3qxbpf801.jpg'
          // add attachments
          // attachments: [
          //   {
          //     image_url: answer,
          //     text: ``
          //   }
          // ]
      }, (err,response) => { console.log(err) });
      // bot.reply(message, );
    }
  });
};