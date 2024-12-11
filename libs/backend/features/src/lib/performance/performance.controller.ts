import { Controller, Logger, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@festival-planner/backend/auth';
import { IPerformance } from '@festival-planner/shared/api';
import { PerformanceService } from './performance.service';

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
    create(@Request() req: any): Promise<IPerformance | null> {
        this.logger.log('req.user.user_id = ', req.user.user_id);
        return this.performanceService.create(req);
    }
}