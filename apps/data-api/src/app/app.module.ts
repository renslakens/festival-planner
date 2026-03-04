import { Module } from '@nestjs/common';
import { BackendFeaturesMealModule } from '../../../../libs/backend/features/src/index';
import { UserModule } from '../../../../libs/backend/user/src/index';
import { AuthModule } from '../../../../libs/backend/auth/src/index';
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
export class AppModule { }