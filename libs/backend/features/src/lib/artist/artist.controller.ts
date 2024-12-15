import { Controller, Delete, Logger, Put, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthGuard } from '@festival-planner/backend/auth';
import { IArtist } from '@festival-planner/shared/api';
import { ArtistService } from './artist.service';
import { UpdateArtistDto } from '@festival-planner/backend/dto';

@Controller('artist')
export class ArtistController {
    private readonly logger = new Logger(ArtistController.name);

    constructor(private artistService: ArtistService) {}

    @Get('')
    getAll(): Promise<IArtist[]> {
        return this.artistService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IArtist | null> {
        return this.artistService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() artist: UpdateArtistDto): Promise<IArtist | null> {
        return this.artistService.update(id, artist);
    }

    @Post('')
    @UseGuards(AdminGuard)
    create(@Request() req: any): Promise<IArtist | null> {
        this.logger.log('req.user.user_id = ', req.user.user_id);
        return this.artistService.create(req);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string): Promise<IArtist | null> {
        return this.artistService.delete(id);
    }
}