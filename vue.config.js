const merge = require('webpack-merge');
const devConfig = require('./webpack.common.js');
const prodConfig = require('./webpack.prod.js');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  css: { extract: false },
  configureWebpack: () => {
    return isProd ? merge(devConfig, prodConfig) : devConfig
  },
};
