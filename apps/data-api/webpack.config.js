const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  config.externals = [];

  return config;
});