import { Body, Controller, Delete, Logger, Put, Request } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { Get, Param, Post, UseGuards } from '@nestjs/common';
import { IFestival } from '@festival-planner/shared/api';
import { CreateFestivalDto, UpdateFestivalDto } from '@festival-planner/backend/dto';
import { AdminGuard, AuthGuard } from '@festival-planner/backend/auth';

@Controller('festivals')
export class FestivalController {
    private readonly logger = new Logger(FestivalController.name);

    constructor(private festivalService: FestivalService) { }

    @Get('')
    getAll(): Promise<IFestival[]> {
        return this.festivalService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IFestival | null> {
        return this.festivalService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() festival: UpdateFestivalDto, @Request() req: any): Promise<IFestival | null> {
        return this.festivalService.update(id, festival, req.user._id);
    }

    @Post('')
    @UseGuards(AdminGuard)
    create(@Request() req: any): Promise<IFestival | null> {
        if (!req.user) {
            this.logger.error('User is not set in the request object');
        }

        this.logger.log('req.user.user_id = ', req.user._id);
        return this.festivalService.create(req, req.user._id);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string, @Request() req: any): Promise<IFestival | null> {
        return this.festivalService.delete(id, req.user._id);
    }
}