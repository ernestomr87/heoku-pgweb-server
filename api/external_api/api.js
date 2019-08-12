"use strict";
const axios = require("axios");

const APP_CONFIG = require(`./../../config/${process.env.NODE_APP}.json`);
const BASE_URL = `${APP_CONFIG.host}:${APP_CONFIG.port}`;
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
        notiflink: `${BASE_URL}/api/notification`,
        username,
        apikey: API_KEY,
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
        notiflink: `${BASE_URL}/api/notification`,
        fileId,
        processOptionId,
        apikey: API_KEY
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
        notiflink: `${BASE_URL}/api/notification`,
        username,
        apikey: API_KEY,
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
        notiflink: `${BASE_URL}/api/notification`,
        apikey: API_KEY,
        guids
      }
    });
  },

  retrievefile: function retrieveFile(guid) {
    return axios({
      method: "post",
      url: `${API_ENGINE}retrievefile`,
      data: {
        notiflink: `${BASE_URL}/api/notification`,
        apikey: API_KEY,
        guid
      }
    });
  }
};
