const { isNil, sumBy } = require('./functions');

const intializeUser = (user, controller) => {
  controller.storage.users.save({
    id: user,
    karma: 0
  });
};

const setKarma = (value, user, controller) => {
  controller.storage.users.save({
    id: user,
    karma: value
  });
};

const userExsists = async (user, controller) => {
  const userObj = await getUser(user, controller);
  return !isNil(userObj);
};

const getUser = async (user, controller) => {
  let userObj;
  const v2 = await controller.storage.users.get(user, (err, val) => {
    userObj = val;
    return val;
  });
  return userObj;
};

const getCurrentKarma = async (user, controller) => {
  const curUser = await getUser(user, controller);
  return curUser?.karma || 0;
};

const addKarma = async (user, controller) => {
  const userExisits = await userExsists(user, controller);
  if (userExisits) {
    const curKarma = await getCurrentKarma(user, controller);
    await setKarma(curKarma + 1, user, controller);
  } else {
    await intializeUser(user, controller);
    setKarma(1, user, controller);
  }
};

const removeKarma = async (user, controller) => {
  const userExisits = await userExsists(user, controller);
  if (userExisits) {
    const curKarma = await getCurrentKarma(user, controller);
    await setKarma(curKarma - 1, user, controller);
  } else {
    await intializeUser(user, controller);
    await setKarma(-1, user, controller);
  }
};

const getAllUsers = async (controller) => {
  let users = [];
  await controller.storage.users.all((err, val) => {
    users = val;
  });
  return users;
};

const formatUsersKarma = (users) => {
  const roomKarma = sumBy(users, 'karma');
  
  let lines = roomKarma >= 0 ? 
    `I am a Jedi. I’m one with the Force, and the Force will guide me\nEveryone's karma is at ${roomKarma}\n` :
    `Good, good, let the hate flow through you\nEveryone's karma is at ${roomKarma}\n`;
  
  users.forEach((user) => {
    lines = `${lines}<@${user.id}>: ${user.karma}\n`
  });
  return { lines, roomKarma };
};

module.exports = {
  addKarma,
  removeKarma,
  getCurrentKarma,
  getAllUsers,
  formatUsersKarma
};
