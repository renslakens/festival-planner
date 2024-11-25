import { Controller, Logger, Request } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { IFestival } from '@festival-planner/shared/api';
import { CreateFestivalDto } from '@festival-planner/backend/dto';
import { AuthGuard } from '@festival-planner/backend/auth';

@Controller('festival')
export class FestivalController {
    private readonly logger = new Logger(FestivalController.name);

    constructor(private festivalService: FestivalService) {}

    @Get('')
    getAll(): Promise<IFestival[]> {
        return this.festivalService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IFestival | null> {
        return this.festivalService.findOne(id);
    }

    /**
     * Create a new Meal. The cook is the user that creates the new document in the DB.
     * De _id van de user wordt via het token meegestuurd - dus NIET als veld in de body!
     * De AuthGuard is een filter dat via middleware wordt aangeroepen voordat de Controller
     * het reqest ontvangt. De AuthGuard geeft de rout handling door via de next() functie.
     *
     * @param req Het binnenkomend request. Deze bevat de req.body die in het request is gestuurd,
     * én bevat de user_id die door de AuthGuard uit het Bearer token is gelezen. Bekijk de AuthGuard!
     * @returns
     */
    @Post('')
    @UseGuards(AuthGuard)
    create(@Request() req: any): Promise<IFestival | null> {
        this.logger.log('req.user.user_id = ', req.user.user_id);
        return this.festivalService.create(req);
    }
}