import { Module } from '@nestjs/common';
import { CreateFestivalDto, UpdateFestivalDto } from './festival.dto';
import { CreateTicketDto, UpdateTicketDto } from './ticket.dto';

@Module({
  controllers: [],
  providers: [],
  exports: [CreateFestivalDto, UpdateFestivalDto, CreateTicketDto, UpdateTicketDto],
})
export class DtoModule {}