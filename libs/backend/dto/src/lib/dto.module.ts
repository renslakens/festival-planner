import { Module } from '@nestjs/common';
import { CreateFestivalDto, UpdateFestivalDto } from './festival.dto';

@Module({
  controllers: [],
  providers: [],
  exports: [CreateFestivalDto, UpdateFestivalDto],
})
export class DtoModule {}