import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { IFestival } from '@festival-planner/shared/api';
import { CreateFestivalDto } from '@festival-planner/backend/dto';

@Controller('festival')
export class FestivalController {
    constructor(private festivalService: FestivalService) {}

    @Get('')
    getAll(): IFestival[] {
        return this.festivalService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): IFestival {
        return this.festivalService.getOne(id);
    }

    @Post('')
    create(@Body() data: CreateFestivalDto): IFestival {
        return this.festivalService.create(data);
    }
}
