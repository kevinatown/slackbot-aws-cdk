/*
 *
 * This will be used as a catch all for 
 *
 */

const MANAGERISMS = [
  'Please create a ticket for this issue.',
  "Let's stay on topic.",
  "Let's take this offline.",
  'Is this tracked in JIRA?',
  'Somehow I manage'
];

module.exports = function (controller) {
  controller.hears(['.*', ''], 'direct_message,direct_mention,mention', async(bot, message) => {
    try {
      await bot.reply(message, sampleArray(MANAGERISMS));
    } catch (error) {
      console.error(error);
    }
  });
};
