module.exports = function(controller) {
  controller.on('member_joined_channel', (bot, message) => {
    const { user } = message;
   
    bot.reply(message, `Welcome, <@${user}> to the team. I look forward to you adding value.`);

  });
}
