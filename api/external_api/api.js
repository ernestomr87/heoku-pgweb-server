"use strict";
const apiKey = require("./../../config/config")["apiKey"];
const axios = require("axios");
const pageanApiAddress = "http://prod.pangeamt.com:8080/PGFile/v1/";

module.exports = {
  describeEngines: function describeEngines() {
    console.log(`${pageanApiAddress}describeengines/${apiKey}`);
    return axios({
      method: "get",
      url: `${pageanApiAddress}describeengines/${apiKey}`,
      proxy: {
        host: "192.168.0.2",
        port: 3128
      }
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
      },
      proxy: {
        host: "192.168.0.2",
        port: 3128
      }
    });
  },

  processFileAfterQuoteFile: function processFile(fileId, processOptionId) {
    return axios({
      method: "post",
      url: `${pageanApiAddress}processfile`,
      data: {
        fileId,
        processOptionId,
        apikey: apiKey
      },
      proxy: {
        host: "192.168.0.2",
        port: 3128
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
      },
      proxy: {
        host: "192.168.0.2",
        port: 3128
      }
    });
  },

  filestatus: function retrieveFile(guids) {
    return axios({
      method: "post",
      url: `${pageanApiAddress}filestatus`,
      data: {
        apikey: apiKey,
        guids
      },
      proxy: {
        host: "192.168.0.2",
        port: 3128
      }
    });
  },

  retrievefile: function retrieveFile(guid) {
    return axios({
      method: "post",
      url: `${pageanApiAddress}retrievefile`,
      data: {
        apikey: apiKey,
        guid
      },
      proxy: {
        host: "192.168.0.2",
        port: 3128
      }
    });
  }
};
