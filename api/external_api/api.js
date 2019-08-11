"use strict";
const axios = require("axios");

const APP_CONFIG = require(`./../../config/${process.env.NODE_APP}.json`);
const API_KEY = APP_CONFIG.apiKey;
const API_ENGINE = APP_CONFIG.enginesApi;

module.exports = {
  describeEngines: function describeEngines() {
    return axios({
      method: "get",
      url: `${API_ENGINE}describeengines/${API_KEY}`
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
      method: "post",
      url: `${API_ENGINE}processfile`,
      data: {
        username,
        API_KEY: API_KEY,
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
      method: "post",
      url: `${API_ENGINE}processfile`,
      data: {
        fileId,
        processOptionId,
        API_KEY: API_KEY
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
      method: "post",
      url: `${API_ENGINE}quotefile`,
      data: {
        username,
        API_KEY: API_KEY,
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
      method: "post",
      url: `${API_ENGINE}filestatus`,
      data: {
        API_KEY: API_KEY,
        guids
      }
    });
  },

  retrievefile: function retrieveFile(guid) {
    return axios({
      method: "post",
      url: `${API_ENGINE}retrievefile`,
      data: {
        API_KEY: API_KEY,
        guid
      }
    });
  }
};
