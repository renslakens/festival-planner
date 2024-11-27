import { Module } from '@nestjs/common';
import { BackendFeaturesMealModule } from '@festival-planner/backend/features';
import { UserModule } from '@festival-planner/backend/user';
import { AuthModule } from '@festival-planner/backend/auth';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv';

@Module({
    imports: [
        BackendFeaturesMealModule,
        AuthModule,
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
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}