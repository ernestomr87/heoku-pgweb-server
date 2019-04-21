'use strict';
const apiKey = require('./../../config/config')['apiKey'];
const axios = require('axios');
const pageanApiAddress = 'http://prod.pangeamt.com:8080/PGFile/v1/';

module.exports = {
  describeEngines: function describeEngines() {
    console.log(`${pageanApiAddress}describeengines/${apiKey}`);
    return axios({
      method: 'get',
      url: `${pageanApiAddress}describeengines/${apiKey}`
    });
  },

  processFile: function processFile(
    username,
    source,
    target,
    engineid,
    fileName,
    fileType,
    file
  ) {
    return axios({
      method: 'post',
      url: `${pageanApiAddress}processfile`,
      data: {
        username,
        apikey: apiKey,
        source,
        target,
        engineid,
        fileName,
        fileType,
        file
      }
    });
  },

  processFileAfterQuoteFile: function processFile(fileId, processOptionId) {
    return axios({
      method: 'post',
      url: `${pageanApiAddress}processfile`,
      data: {
        fileId,
        processOptionId,
        apikey: apiKey
      }
    });
  },

  quoteFile: function processFile(
    username,
    source,
    target,
    engineid,
    fileName,
    fileType,
    file
  ) {
    return axios({
      method: 'post',
      url: `${pageanApiAddress}quotefile`,
      data: {
        username,
        apikey: apiKey,
        source,
        target,
        engineid,
        fileName,
        fileType,
        file
      }
    });
  },

  filestatus: function retrieveFile(guids) {
    return axios({
      method: 'post',
      url: `${pageanApiAddress}filestatus`,
      data: {
        apikey: apiKey,
        guids
      }
    });
  },
  
  retrievefile: function retrieveFile(guid) {
    return axios({
      method: 'post',
      url: `${pageanApiAddress}retrievefile`,
      data: {
        apikey: apiKey,
        guid
      }
    });
  }
};
