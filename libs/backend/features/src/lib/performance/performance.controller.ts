import { Controller, Logger, Put, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@festival-planner/backend/auth';
import { IPerformance } from '@festival-planner/shared/api';
import { PerformanceService } from './performance.service';
import { UpdatePerformanceDto } from '@festival-planner/backend/dto';

@Controller('performance')
export class PerformanceController {
    private readonly logger = new Logger(PerformanceController.name);

    constructor(private performanceService: PerformanceService) {}

    @Get('')
    getAll(): Promise<IPerformance[]> {
        return this.performanceService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IPerformance | null> {
        return this.performanceService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    update(@Param('id') id: string, @Body() performance: UpdatePerformanceDto): Promise<IPerformance | null> {
        return this.performanceService.update(id, performance);
    }

    @Post('')
    @UseGuards(AuthGuard)
    create(@Request() req: any): Promise<IPerformance | null> {
        this.logger.log('req.user.user_id = ', req.user.user_id);
        return this.performanceService.create(req);
    }
}