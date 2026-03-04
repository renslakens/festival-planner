const { composePlugins, withNx } = require('@nx/webpack');
const path = require('path');

module.exports = composePlugins(withNx(), (config) => {
  // 1. De paden forceren (die we net hadden gemaakt)
  config.resolve.alias = {
    ...config.resolve.alias,
    '@festival-planner/backend/auth': path.resolve(__dirname, '../../libs/backend/auth/src/index.ts'),
    '@festival-planner/backend/dto': path.resolve(__dirname, '../../libs/backend/dto/src/index.ts'),
    '@festival-planner/backend/features': path.resolve(__dirname, '../../libs/backend/features/src/index.ts'),
    '@festival-planner/backend/neo4j': path.resolve(__dirname, '../../libs/backend/neo4j/src/index.ts'),
    '@festival-planner/backend/user': path.resolve(__dirname, '../../libs/backend/user/src/index.ts'),
    '@festival-planner/common': path.resolve(__dirname, '../../libs/frontend/common/src/index.ts'),
    '@festival-planner/features': path.resolve(__dirname, '../../libs/frontend/features/src/index.ts'),
    '@festival-planner/shared/api': path.resolve(__dirname, '../../libs/shared/api/src/index.ts'),
    '@festival-planner/ui': path.resolve(__dirname, '../../libs/frontend/ui/src/index.ts'),
    '@festival-planner/util-env': path.resolve(__dirname, '../../libs/shared/util-env/src/index.ts')
  };

  // 2. Tegen Webpack zeggen dat hij de NestJS optionele pakketten mag negeren
  const lazyImports = [
    '@nestjs/microservices',
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    'kafkajs',
    'mqtt',
    'nats',
    'ioredis',
    'amqplib',
    'amqp-connection-manager',
    '@nestjs/platform-socket.io'
  ];

  config.externals = [
    ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
    function ({ context, request }, callback) {
      if (lazyImports.includes(request)) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    }
  ].filter(Boolean);

  return config;
});