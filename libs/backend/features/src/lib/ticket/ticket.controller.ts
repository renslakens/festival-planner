import { Controller, Delete, Logger, Put, Request } from '@nestjs/common';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthGuard } from '@festival-planner/backend/auth';
import { ITicket } from '@festival-planner/shared/api';
import { TicketService } from './ticket.service';
import { UpdateTicketDto } from '@festival-planner/backend/dto';

@Controller('ticket')
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
    create(@Request() req: any): Promise<ITicket | null> {
        this.logger.log('req.user.user_id = ', req.user.user_id);
        return this.ticketService.create(req);
    }

    @Post(':id/purchase')
    @UseGuards(AuthGuard)
    purchaseTicket(
        @Param('id') id: string, // Use string if the ID is a MongoDB ObjectId
        @Request() req: any // Inject the request object to access `req.user`
    ): Promise<ITicket | null> {
        return this.ticketService.purchaseTicket(id, req.user.user_id);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string): Promise<ITicket | null> {
        return this.ticketService.delete(id);
    }
}