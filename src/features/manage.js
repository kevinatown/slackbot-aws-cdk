const { sampleArray } = require('../utils/functions');

const MANAGEMENT_QUOTES = [
  'Thank you. I’m glad you’ll use this as a good leaning experience.',
  'What’s the best way to move us forward from here?',
  'When do you next meet with Chris?',
  'Why didn’t you elevate that to me and ask for help?',
  'We missed two deadlines. What are you going to do to get us on track?',
  'So how are we going to overcome it?'
];

const MISMANAGEMENT_QUOTES = [
  'Just dab until it goes away.',
  "If you run faster than your problems, they can't catch you.",
  'Find truth in the alley behind work with ketamine.',
  'I guess we won’t do this project then.',
  'Okay, that’s great.',
  'Oh, well, that’s not your fault',
  'Well, keep me posted.',
  'That’s ok. These things happen, I know you’re really busy.',
  'That’s okay. It’s not a big deal.'
];

module.exports = function (controller) {
  controller.hears(['mismanage me'], ['direct_message','direct_mention','mention','message','ambient'], async(bot, message) => {
    try {
      await bot.reply(message, sampleArray(MISMANAGEMENT_QUOTES));
    } catch (error) {
      console.error(error);
    }
  });

  controller.hears(['manage me'], ['direct_message','direct_mention','mention','message','ambient'], async(bot, message) => {
    try {
      console.log(message);
      await bot.reply(message, sampleArray(MANAGEMENT_QUOTES));
    } catch (error) {
      console.error(error);
    }
  });
};
