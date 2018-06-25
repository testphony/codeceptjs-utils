const cuid = require('cuid');
const assert = require('assert');

module.exports.cropLongData = (data, maxLenght = 200) => {
  if (typeof data === 'object' || Array.isArray(data)) {
    data = JSON.stringify(data, null, 2);
  } else {
    try {
      data = JSON.stringify(JSON.parse(data), null, 2);
    } catch (err) {
      return data;
    }
  }
  let finalString;
  const lines = data.split(/\r\n|\r|\n/).length;
  if (lines > maxLenght) {
    const regex = new RegExp(`^((.*?\\S\\n){${maxLenght}})`, 'g'); // match first maxLenght lines
    finalString = `${data.match(regex)}\n..... and ${lines - maxLenght} lines more`;
  } else finalString = JSON.stringify(JSON.parse(data), null, 2);
  return finalString;
};

module.exports.skipLongData = (data, maxLenght = 128) => {
  let tmp;
  if (typeof data === 'object' || Array.isArray(data)) {
    tmp = JSON.stringify(data, null, 2);
  } else return data;
  const lines = tmp.split(/\r\n|\r|\n/).length;
  if (lines > maxLenght) return 'Data is too big. Skip displaying';
  return data;
};

// eslint-disable-next-line no-multi-assign
const walkSync = module.exports.walkSync = (dir, filelist, subfolder = '') => {
  // eslint-disable-next-line global-require
  const fs = require('fs');
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach((file) => {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(`${dir + file}/`, filelist, `${subfolder}${file}/`);
    } else {
      filelist.push(`${subfolder}${file}`);
    }
  });
  return filelist;
};

module.exports.generateCorrelationId = () => `qa-${cuid()}`;

module.exports.deepEqual = (actual, expected, message) => {
  try {
    assert.deepEqual(actual, expected, message);
    return true;
  } catch (err) {
    return false;
  }
};
