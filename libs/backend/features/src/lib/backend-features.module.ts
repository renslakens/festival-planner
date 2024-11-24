import { Module } from '@nestjs/common';
import { FestivalController } from './festival/festival.controller';
import { FestivalService } from './festival/festival.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Festival, FestivalSchema } from './festival/festival.schema';
import { JwtModule } from '@nestjs/jwt';

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
export class FestivalModule {}
