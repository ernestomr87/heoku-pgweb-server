const config = require(`./${process.env.NODE_APP}.json`);

const common = {
  urls: {
    // base: `http://localhost:3004`,
    base: `http://pgweb.pangeamt.com:3004`,
    download: (hostClient, uuid) => `${hostClient}/main/download/${uuid}`,
    casual_404: hostClient => `${hostClient}/main/404`,
    register_404: hostClient => `${hostClient}/dashboard/404`,
    casual_error: (hostClient, uuid) =>
      `${hostClient}/main/process/${uuid}/error`,
    register_error: (hostClient, uuid) =>
      `${hostClient}/dashboard/process-services/${uuid}/error`,
    casual_success: (hostClient, uuid) =>
      `${hostClient}/main/process/${uuid}/success`,
    register_success: (hostClient, uuid) =>
      `${hostClient}/dashboard/process-services/${uuid}/success`,
    casual_cancel: (hostClient, uuid) =>
      `${hostClient}/main/process/${uuid}/cancel`,
    register_cancel: (hostClient, uuid) =>
      `${hostClient}/dashboard/process-services/${uuid}/cancel`
  }
};

module.exports = common;
