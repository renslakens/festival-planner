import { Controller, Delete, Logger, Put, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthGuard } from '@festival-planner/backend/auth';
import { IPerformance } from '@festival-planner/shared/api';
import { PerformanceService } from './performance.service';
import { CreatePerformanceDto, UpdatePerformanceDto } from '@festival-planner/backend/dto';

@Controller('performances')
export class PerformanceController {
    private readonly logger = new Logger(PerformanceController.name);

    constructor(private performanceService: PerformanceService) { }

    @Get('')
    getAll(): Promise<IPerformance[]> {
        return this.performanceService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IPerformance | null> {
        return this.performanceService.findOne(id);
    }

    @Get('stage/:id')
    getPerformancesByStageId(@Param('id') id: string): Promise<IPerformance[] | null> {
        return this.performanceService.findPerformancesByStageId(id);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() performance: UpdatePerformanceDto, @Request() req: any): Promise<IPerformance | null> {
        return this.performanceService.update(id, performance, req.user._id);
    }

    @Post('')
    @UseGuards(AdminGuard)
    create(@Body() createDto: CreatePerformanceDto, @Request() req: any): Promise<IPerformance | null> {
        this.logger.log('Binnenkomende Performance Data: ' + JSON.stringify(createDto));
        return this.performanceService.create(createDto, req.user._id);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string, @Request() req: any): Promise<IPerformance | null> {
        return this.performanceService.delete(id, req.user._id);
    }
}