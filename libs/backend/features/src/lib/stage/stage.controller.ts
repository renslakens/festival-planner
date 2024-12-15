import { Controller, Logger, Put, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@festival-planner/backend/auth';
import { IStage } from '@festival-planner/shared/api';
import { StageService } from './stage.service';
import { UpdateStageDto } from '@festival-planner/backend/dto';

@Controller('stage')
export class StageController {
    private readonly logger = new Logger(StageController.name);

    constructor(private stageService: StageService) {}

    @Get('')
    getAll(): Promise<IStage[]> {
        return this.stageService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IStage | null> {
        return this.stageService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    update(@Param('id') id: string, @Body() stage: UpdateStageDto): Promise<IStage | null> {
        return this.stageService.update(id, stage);
    }

    @Post('')
    @UseGuards(AuthGuard)
    create(@Request() req: any): Promise<IStage | null> {
        this.logger.log('req.user.user_id = ', req.user.user_id);
        return this.stageService.create(req);
    }
}