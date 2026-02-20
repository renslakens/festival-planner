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

    @Get(':id')
    getOne(@Param('id') id: string): Promise<ITicket | null> {
        return this.ticketService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() ticket: UpdateTicketDto): Promise<ITicket | null> {
        return this.ticketService.update(id, ticket);
    }

    @Post('')
    @UseGuards(AdminGuard)
    create(@Body() createTicketDto: CreateTicketDto, @Request() req: any): Promise<ITicket | null> {
        const userId = req.user?.user_id || req.user?.sub;
        this.logger.log(`Creating ticket. req.user.user_id = ${userId}`);
        return this.ticketService.create(createTicketDto, userId);
    }

    @Post(':id/purchase')
    @UseGuards(AuthGuard) // Iedere ingelogde gebruiker mag kopen
    purchaseTicket(
        @Param('id') id: string,
        @Request() req: any
    ): Promise<ITicket | null> {
        const userId = req.user?.user_id || req.user?.sub;
        this.logger.log(`User ${userId} purchasing ticket ${id}`);
        return this.ticketService.purchaseTicket(id, userId);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string): Promise<ITicket | null> {
        return this.ticketService.delete(id);
    }
}