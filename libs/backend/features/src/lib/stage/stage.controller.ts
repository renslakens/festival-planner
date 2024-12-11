import { Controller, Logger, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@festival-planner/backend/auth';
import { IStage } from '@festival-planner/shared/api';
import { StageService } from './stage.service';

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
    create(@Request() req: any): Promise<IStage | null> {
        this.logger.log('req.user.user_id = ', req.user.user_id);
        return this.stageService.create(req);
    }
}