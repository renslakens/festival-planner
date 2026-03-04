const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  // Handle NestJS lazy-loading warnings
  config.ignoreWarnings = [
    { module: /@nestjs\/common/ },
    { module: /@nestjs\/core/ },
    { module: /express/ },
    { module: /mongodb/ }
  ];

  return config;
});