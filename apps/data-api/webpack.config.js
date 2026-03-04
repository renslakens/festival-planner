const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  // Silence the dynamic dependency warnings
  config.ignoreWarnings = [
    { module: /@nestjs\/common/ },
    { module: /@nestjs\/core/ },
    { module: /express/ },
    { module: /mongodb/ },
    /Critical dependency/
  ];

  config.externals = [
    ...(config.externals || []),
    '@nestjs/microservices',
    '@nestjs/websockets',
    '@nestjs/websockets/socket-module',
    '@nestjs/microservices/microservices-module',
    'cache-manager',
    'class-transformer',
    'class-validator',
  ];

  return config;
});