const { sampleArray } = require('../utils/functions');

const eightBallGifs = [
  'https://media1.giphy.com/media/sPJYmkAJ6UJGw/giphy.gif',
  'https://media.giphy.com/media/3ohuAvuDVhjEYonjkk/giphy.gif',
  'https://i.gifer.com/W2uA.gif',
  'https://i.imgur.com/nP4QoSL.gif',
  'https://78.media.tumblr.com/14515db26f0c4da75500c118a94fc247/tumblr_p16bh9Z3A01qgvqxoo4_r1_400.gif',
  'https://i.imgur.com/aoA6X84.gif',
  'https://i.redd.it/yhxohz6eorp01.gif',
  'https://www.unilad.co.uk/wp-content/uploads/2016/05/rethink.gif',
  'https://assets.rbl.ms/10754687/980x.gif'
];

module.exports = function(controller) {
  controller.hears([new RegExp(/(magic 8-ball)\s\w+/i),], 'direct_message,direct_mention,mention', (bot, message) => {
    if (message.match) {  
      const answer = sampleArray(eightBallGifs);
      bot.api.chat.postMessage({
        channel: message.channel,
        ts: message.ts,
        unfurl_media: true,
        unfurl_links: true,
        token: process.env.slackToken,
        attachments: [
          {
            image_url: answer,
            text: ``
          }
        ]
      }, (err,response) => { console.log(err) });
    }
  });
};
