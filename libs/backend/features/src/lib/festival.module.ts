import { Module } from '@nestjs/common';
import { FestivalController } from './festival/festival.controller';
import { FestivalService } from './festival/festival.service';

@Module({
  controllers: [FestivalController],
  providers: [FestivalService],
  exports: [FestivalService],
})
export class FestivalModule {}
