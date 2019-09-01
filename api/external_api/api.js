"use strict";
const axios = require("axios");

const APP_CONFIG = require(`./../../config/${process.env.NODE_APP}.json`);
const BASE_URL = `${APP_CONFIG.host}:${APP_CONFIG.port}`;
const API_KEY = APP_CONFIG.apiKey;
const API_ENGINE = APP_CONFIG.enginesApi;
const API_ENGINE_NEX_RELAY = APP_CONFIG.enginesApiNexRelay;

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
  },

  //API NODES
  getNodes: () => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/nodes`,
      data: {}
    });
  },
  addNode: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/addnode`,
      data: {
        ...data
      }
    });
  },
  delNode: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/delnode`,
      data: {
        ...data
      }
    });
  },
  restartNode: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/restartnode`,
      data: {
        ...data
      }
    });
  },

  //API MODELS
  getModels: () => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/models`,
      data: {}
    });
  },
  addModel: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/addmodel`,
      data: { ...data }
    });
  },
  delModel: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/delmodel`,
      data: { ...data }
    });
  },
  cloneModel: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/clonemodel`,
      data: { ...data }
    });
  },

  //API EDS
    //API MODELS
    getEds: () => {
      return axios({
        method: "post",
        url: `${API_ENGINE_NEX_RELAY}corp/eds`,
        data: {}
      });
    },
    addEd: data => {
      return axios({
        method: "post",
        url: `${API_ENGINE_NEX_RELAY}corp/added`,
        data: { ...data }
      });
    },
    delEd: data => {
      return axios({
        method: "post",
        url: `${API_ENGINE_NEX_RELAY}corp/deled`,
        data: { ...data }
      });
    },
    enabledEd: data => {
      return axios({
        method: "post",
        url: `${API_ENGINE_NEX_RELAY}corp/enable`,
        data: { ...data }
      });
    },
    disabledEd: data => {
      return axios({
        method: "post",
        url: `${API_ENGINE_NEX_RELAY}corp/disableed`,
        data: { ...data }
      });
    },
};
