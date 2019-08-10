const config = require(`./${process.env.NODE_APP}.json`);

const common = {
  urls: {
    download: uuid => `${config.host}:${config.port}/main/download/${uuid}`
  }
};

module.exports = common;
