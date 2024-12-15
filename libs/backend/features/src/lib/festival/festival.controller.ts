import { Body, Controller, Logger, Put, Request } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { Get, Param, Post, UseGuards } from '@nestjs/common';
import { IFestival } from '@festival-planner/shared/api';
import { CreateFestivalDto, UpdateFestivalDto } from '@festival-planner/backend/dto';
import { AdminGuard, AuthGuard } from '@festival-planner/backend/auth';

@Controller('festival')
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
    update(@Param('id') id: string, @Body() festival: UpdateFestivalDto): Promise<IFestival | null> {
        return this.festivalService.update(id, festival);
    }

    @Post('')
    @UseGuards(AdminGuard)
    create(@Request() req: any): Promise<IFestival | null> {
        this.logger.log('req.user:', req.user);
        if (!req.user) {
            this.logger.error('User is not set in the request object');
        }

        this.logger.log('req.user.user_id = ', req.user._id);
        return this.festivalService.create(req);
    }
}