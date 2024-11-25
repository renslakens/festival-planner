import { Module } from '@nestjs/common';
import { FestivalController } from './festival/festival.controller';
import { FestivalService } from './festival/festival.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Festival, FestivalSchema } from './festival/festival.schema';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '@festival-planner/backend/user';
import { AuthModule } from '@festival-planner/backend/auth';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Festival.name, schema: FestivalSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule,
    AuthModule
  ],
  controllers: [FestivalController],
  providers: [FestivalService],
  exports: [FestivalService],
})
export class BackendFeaturesMealModule {}
