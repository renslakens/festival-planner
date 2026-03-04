import { Controller, Delete, Logger, Put, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthGuard } from '@festival-planner/backend/auth';
import { ITicket } from '@festival-planner/shared/api';
import { TicketService } from './ticket.service';
import { CreateTicketDto, UpdateTicketDto } from '@festival-planner/backend/dto';

@Controller('tickets')
export class TicketController {
    private readonly logger = new Logger(TicketController.name);

    constructor(private ticketService: TicketService) { }

    @Get('')
    getAll(): Promise<ITicket[]> {
        return this.ticketService.findAll();
    }

    @Get('my/all')
    @UseGuards(AuthGuard)
    getMyTickets(@Request() req: any): Promise<ITicket[]> {
        const userId = req.user.user_id
        return this.ticketService.findTicketsByUserId(userId);
    }

    @Get('festival/:id')
    getTicketsByFestivalId(@Param('id') festivalId: string): Promise<ITicket[]> {
        return this.ticketService.findTicketsByFestivalId(festivalId);
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<ITicket | null> {
        return this.ticketService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() ticket: UpdateTicketDto, @Request() req: any): Promise<ITicket | null> {
        return this.ticketService.update(id, ticket, req.user._id);
    }

    @Post('')
    @UseGuards(AdminGuard)
    create(@Body() createTicketDto: CreateTicketDto, @Request() req: any): Promise<ITicket | null> {
        const userId = req.user._id;
        this.logger.log(`Creating ticket. req.user._id = ${userId}`);
        return this.ticketService.create(createTicketDto, userId);
    }

    @Post(':id/purchase')
    @UseGuards(AuthGuard) // Iedere ingelogde gebruiker mag kopen
    purchaseTicket(
        @Param('id') id: string,
        @Request() req: any
    ): Promise<ITicket | null> {
        this.logger.log('User: ' + JSON.stringify(req.user));
        const userId = req.user._id;
        this.logger.log(`User ${userId} purchasing ticket ${id}`);
        return this.ticketService.purchaseTicket(id, userId);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string, @Request() req: any): Promise<ITicket | null> {
        return this.ticketService.delete(id, req.user._id);
    }
}