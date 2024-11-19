import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FestivalModule } from '@festival-planner/backend/features';

@Module({
  imports: [FestivalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
