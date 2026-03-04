const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  config.externals = [
    ...(config.externals || []),
    // Ignore optional NestJS dependencies that cause bundle errors
    '@nestjs/microservices',
    '@nestjs/websockets/socket-module',
    '@nestjs/microservices/microservices-module',
    'cache-manager',
    'class-transformer',
    'class-validator'
  ];

  return config;
});