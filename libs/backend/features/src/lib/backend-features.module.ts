import { Module } from '@nestjs/common';
import { FestivalController } from './festival/festival.controller';
import { FestivalService } from './festival/festival.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Festival, FestivalSchema } from './festival/festival.schema';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '@festival-planner/backend/user';
import { AuthModule } from '@festival-planner/backend/auth';
import { Ticket, TicketSchema } from './ticket/ticket.schema';
import { TicketController } from './ticket/ticket.controller';
import { TicketService } from './ticket/ticket.service';
import { Stage, StageSchema } from './stage/stage.schema';
import { StageController } from './stage/stage.controller';
import { StageService } from './stage/stage.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Festival.name, schema: FestivalSchema },
      { name: Ticket.name, schema: TicketSchema },
      { name: Stage.name, schema: StageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule,
    AuthModule
  ],
  controllers: [FestivalController, TicketController, StageController],
  providers: [FestivalService, TicketService, StageService],
  exports: [FestivalService, TicketService, StageService],
})
export class BackendFeaturesMealModule {}
