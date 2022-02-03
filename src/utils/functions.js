const sampleArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

const isNil = (value) => {
  return value === null || value === undefined;
}

const sumBy = (items, property) => {
  return items.map(typeof property === 'function' ? property : item => item[property])
    .reduce((acc, val) => acc + val, 0);
}

module.exports = {
  sampleArray,
  isNil,
  sumBy
};
