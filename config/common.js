const config = require(`./${process.env.NODE_APP}.json`);

const common = {
  urls: {
    base: `http://localhost:3004`,
    // base: `${config.host}:${config.port}`,
    download: uuid => `${config.host}:${config.port}/main/download/${uuid}`,
    casual_404: `${config.host}:${config.port}/main/404`,
    register_404: `${config.host}:${config.port}/dashboard/404`,
    casual_error: (uuid)=>`${config.host}:${config.port}/main/process/${uuid}/error`,
    register_error: (uuid)=>`${config.host}:${config.port}/dashboard/process-services/${uuid}/error`,
    casual_success: (uuid)=>`${config.host}:${config.port}/main/process/${uuid}/success`,
    register_success: (uuid)=>`${config.host}:${config.port}/dashboard/process-services/${uuid}/success`,
    casual_cancel: (uuid)=>`${config.host}:${config.port}/main/process/${uuid}/cancel`,
    register_cancel: (uuid)=>`${config.host}:${config.port}/dashboard/process-services/${uuid}/cancel`
  }
};

module.exports = common;
