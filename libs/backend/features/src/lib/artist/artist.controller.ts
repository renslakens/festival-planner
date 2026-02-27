import { Controller, Delete, Logger, Put, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthGuard } from '@festival-planner/backend/auth';
import { IArtist } from '@festival-planner/shared/api';
import { ArtistService } from './artist.service';
import { CreateArtistDto, UpdateArtistDto } from '@festival-planner/backend/dto';

@Controller('artists')
export class ArtistController {
    private readonly logger = new Logger(ArtistController.name);

    constructor(private artistService: ArtistService) { }

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
    update(@Param('id') id: string, @Body() artist: UpdateArtistDto, @Request() req: any): Promise<IArtist | null> {
        return this.artistService.update(id, artist, req.user._id);
    }

    @Post('')
    @UseGuards(AdminGuard)
    create(@Body() createArtistDto: CreateArtistDto, @Request() req: any): Promise<IArtist | null> {
        return this.artistService.create(createArtistDto, req.user._id);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string, @Request() req: any): Promise<IArtist | null> {
        return this.artistService.delete(id, req.user._id);
    }
}