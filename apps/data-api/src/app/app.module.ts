import { Module } from '@nestjs/common';
import { BackendFeaturesMealModule } from '@festival-planner/backend/features';
import { UserModule } from '@festival-planner/backend/user';
import { AuthModule } from '@festival-planner/backend/auth';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { Neo4jModule, Neo4jScheme } from 'nest-neo4j/dist';

@Module({
    imports: [
        BackendFeaturesMealModule,
        AuthModule,
        MongooseModule.forRoot(process.env.MONGO_DB_CONNECTION_STRING, {
            connectionFactory: (connection) => {
                connection.on('connected', () => {
                    console.log('Mongo is connected');
                    Logger.verbose(
                        `Mongoose db connected to ${process.env.MONGO_DB_CONNECTION_STRING}`
                    );
                });
                connection._events.connected();
                return connection;
            }
        }),
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}