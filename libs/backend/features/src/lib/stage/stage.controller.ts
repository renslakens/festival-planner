import { Controller, Delete, Logger, Put, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthGuard } from '@festival-planner/backend/auth';
import { IStage } from '@festival-planner/shared/api';
import { StageService } from './stage.service';
import { CreateStageDto, UpdateStageDto } from '@festival-planner/backend/dto';

@Controller('stages')
export class StageController {
    private readonly logger = new Logger(StageController.name);

    constructor(private stageService: StageService) { }

    @Get('')
    getAll(): Promise<IStage[]> {
        return this.stageService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IStage | null> {
        return this.stageService.findOne(id);
    }

    @Get('festival/:id')
    getStagesByFestivalId(@Param('id') id: string): Promise<IStage[] | null> {
        return this.stageService.findStagesByFestivalId(id);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() stage: UpdateStageDto): Promise<IStage | null> {
        return this.stageService.update(id, stage);
    }

    @Post('')
    @UseGuards(AdminGuard)
    create(@Body() createStageDto: CreateStageDto, @Request() req: any): Promise<IStage | null> {
        // Probeer verschillende properties voor de user ID (afhankelijk van je auth strategy)
        const userId = req.user?.user_id || req.user?.sub || req.user?._id || 'unknown_user';
        this.logger.log(`Creating stage for user: ${userId}`);

        // Geef DTO en userId los mee aan de service
        return this.stageService.create(createStageDto, userId);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string): Promise<IStage | null> {
        return this.stageService.delete(id);
    }
}