'use strict';

var apiKey = require('./../../config/config')['apiKey'];

var axios = require('axios');

var pageanApiAddress = 'http://prod.pangeamt.com:8080/PGFile/v1/';
module.exports = {
  describeEngines: function describeEngines() {
    console.log("".concat(pageanApiAddress, "describeengines/").concat(apiKey));
    return axios({
      method: 'get',
      url: "".concat(pageanApiAddress, "describeengines/").concat(apiKey)
    });
  },
  processFile: function processFile(username, source, target, engineid, fileName, fileType, file) {
    return axios({
      method: 'post',
      url: "".concat(pageanApiAddress, "processfile"),
      data: {
        username: username,
        apikey: apiKey,
        source: source,
        target: target,
        engineid: engineid,
        fileName: fileName,
        fileType: fileType,
        file: file
      }
    });
  },
  processFileAfterQuoteFile: function processFile(fileId, processOptionId) {
    return axios({
      method: 'post',
      url: "".concat(pageanApiAddress, "processfile"),
      data: {
        fileId: fileId,
        processOptionId: processOptionId,
        apikey: apiKey
      }
    });
  },
  quoteFile: function processFile(username, source, target, engineid, fileName, fileType, file) {
    return axios({
      method: 'post',
      url: "".concat(pageanApiAddress, "quotefile"),
      data: {
        username: username,
        apikey: apiKey,
        source: source,
        target: target,
        engineid: engineid,
        fileName: fileName,
        fileType: fileType,
        file: file
      }
    });
  },
  filestatus: function retrieveFile(guids) {
    return axios({
      method: 'post',
      url: "".concat(pageanApiAddress, "filestatus"),
      data: {
        apikey: apiKey,
        guids: guids
      }
    });
  },
  retrievefile: function retrieveFile(guid) {
    return axios({
      method: 'post',
      url: "".concat(pageanApiAddress, "retrievefile"),
      data: {
        apikey: apiKey,
        guid: guid
      }
    });
  }
};