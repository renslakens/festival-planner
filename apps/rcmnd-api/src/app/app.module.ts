import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule, Neo4jScheme } from 'nest-neo4j/dist';
import { Neo4jBackendModule } from '@festival-planner/backend/neo4j';
import { UserModule } from '@festival-planner/backend/user';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: process.env.NEO4J_SCHEME as Neo4jScheme,
      host: process.env.NEO4J_HOST || 'localhost',
      port: process.env.NEO4J_PORT || 7687,
      username: process.env.NEO4J_USERNAME || 'neo4j',
      password: process.env.NEO4J_PASSWORD || 'neo4j',
  }),
  MongooseModule.forRoot(process.env.MONGO_DB_CONNECTION_STRING || "mongodb://localhost:27017/festival-planner", {
    connectionFactory: (connection) => {
        connection.on('connected', () => {
            console.log('Mongo is connected');
            Logger.verbose(
                `Mongoose db connected to ${process.env.MONGO_DB_CONNECTION_STRING || "mongodb://localhost:27017/festival-planner"}`
            );
        });
        connection._events.connected();
        return connection;
    }
}),
    UserModule,
    Neo4jBackendModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
