import { Module } from '@nestjs/common';
import { BackendFeaturesMealModule } from '@festival-planner/backend/features';
import { UserModule } from '@festival-planner/backend/user';
import { AuthModule } from '@festival-planner/backend/auth';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '@festival-planner/shared/util-env';
import { Logger } from '@nestjs/common';

@Module({
    imports: [
        BackendFeaturesMealModule,
        AuthModule,
        MongooseModule.forRoot(environment.MONGO_DB_CONNECTION_STRING, {
            connectionFactory: (connection) => {
                connection.on('connected', () => {
                    // console.log('is connected');
                    Logger.verbose(
                        `Mongoose db connected to ${environment.MONGO_DB_CONNECTION_STRING}`
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