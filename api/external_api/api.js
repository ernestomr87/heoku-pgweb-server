"use strict";
const axios = require("axios");
const request = require("request");
const followRedirects = require("follow-redirects");

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
    file,
    apikey
  ) {
    return axios({
      method: "post",
      url: `${API_ENGINE}processfile`,
      data: {
        notiflink: `${BASE_URL}/api/notification`,
        username,
        apikey,
        source,
        target,
        engineid,
        fileName,
        fileType,
        file
      }
    });
  },
  processFileAfterQuoteFile: function processFile(
    fileId,
    processOptionId,
    apikey
  ) {
    return axios({
      method: "post",
      url: `${API_ENGINE}processfile`,
      data: {
        notiflink: `${BASE_URL}/api/notification`,
        fileId,
        processOptionId,
        apikey
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
    file,
    apikey
  ) {
    return axios({
      method: "post",
      url: `${API_ENGINE}quotefile`,
      data: {
        notiflink: `${BASE_URL}/api/notification`,
        username,
        apikey,
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
  retrievefile: function retrieveFile(guid, apikey) {
    return axios({
      method: "post",
      url: `${API_ENGINE}retrievefile`,
      data: {
        notiflink: `${BASE_URL}/api/notification`,
        apikey,
        guid
      }
    });
  },
  downloadfile: function retrieveFile(fileid, apikey) {
    return axios({
      method: "get",
      responseType: "stream",
      url: `${API_ENGINE}download?fileid=${fileid}&apikey=${apikey}`
    });
  },
  sendfileV2: function(form) {
    return axios
      .create({
        headers: form.getHeaders()
      })
      .post(`${API_ENGINE}sendfile`, form);
  },
  sendfile: function(form) {
    followRedirects.maxRedirects = 10;
    followRedirects.maxBodyLength = 500 * 1024 * 1024; // 500 MB

    // return axios({
    //   url: `${API_ENGINE}sendfile`,
    //   headers: {
    //     maxContentLength: Infinity,
    //     maxBodyLength: Infinity,
    //     "content-type": "multipart/form-data"
    //   },
    //   method: "post",
    //   data: {
    //     ...form
    //   }
    // });

    // return axios
    //   .create({
    //     headers: {
    //       maxContentLength: Infinity,
    //       maxBodyLength: Infinity,
    //       "content-type": "multipart/form-data"
    //     }
    //   })
    //   .post(`${API_ENGINE}sendfile`, form);

    return new Promise((resolve, reject) => {
      try {
        request.post(
          { url: `${API_ENGINE}sendfile`, formData: form },
          function optionalCallback(err, httpResponse, body) {
            if (err) {
              return reject(err);
            } else {
              return resolve(JSON.parse(body));
            }
          }
        );
      } catch (error) {
        return reject(error);
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
  enabledNode: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/enablenode`,
      data: {
        ...data
      }
    });
  },
  disabledNode: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/disablenode`,
      data: {
        ...data
      }
    });
  },

  //API MODELS
  getModels: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/models`,
      data: { ...data }
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
  getEds: form => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/eds`,
      data: { ...form }
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
      url: `${API_ENGINE_NEX_RELAY}corp/enableed`,
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

  //API SERVICES
  getServices: form => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/services`,
      data: { ...form }
    });
  },

  //API ENGINES
  getEngines: form => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/engines`,
      data: { ...form }
    });
  },
  addEngine: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/addengine`,
      data: { ...data }
    });
  },
  delEngine: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/delengine`,
      data: { ...data }
    });
  },
  enabledEngine: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/enableengine`,
      data: { ...data }
    });
  },
  disabledEngine: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/disableengine`,
      data: { ...data }
    });
  },
  enginesByAdmin: () => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/engines`
    });
  },
  enginesByUser: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/userengines`,
      data: { ...data }
    });
  },
  enginesByClient: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/clientengines`,
      data: { ...data }
    });
  },
  addClientEngine: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/addclientengine`,
      data: { ...data }
    });
  },
  addUserEngine: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/adduserengine`,
      data: { ...data }
    });
  },
  delUserEngine: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/deluserengine`,
      data: { ...data }
    });
  },
  delClientEngine: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/delclientengine`,
      data: { ...data }
    });
  },

  updateClientEngine: data => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/updateclientengine`,
      data: { ...data }
    });
  },

  //USERS
  addClient: form => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/addclient`,
      data: { ...form }
    });
  },
  addUser: form => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/adduser`,
      data: { ...form }
    });
  },
  delClient: form => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/delclient `,
      data: { ...form }
    });
  },
  delUser: form => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/deluser`,
      data: { ...form }
    });
  },
  getstats: form => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}corp/getStats`,
      data: { ...form }
    });
  },
  translate: form => {
    return axios({
      method: "post",
      url: `${API_ENGINE_NEX_RELAY}translate`,
      data: { ...form }
    });
  }
};
