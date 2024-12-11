import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from 'nest-neo4j/dist';
import { Neo4jBackendModule } from '@festival-planner/backend/neo4j';

@Module({
  imports: [Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'password',
    }),
    Neo4jBackendModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
