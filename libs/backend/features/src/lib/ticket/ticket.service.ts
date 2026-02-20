import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    UserDocument,
    User as UserModel
} from '@festival-planner/backend/user';
import { Ticket as TicketModel, TicketDocument } from './ticket.schema';
import { Festival as FestivalModel, FestivalDocument } from '../festival/festival.schema';
import { ITicket } from '@festival-planner/shared/api';
import { CreateTicketDto, UpdateTicketDto } from '@festival-planner/backend/dto';

@Injectable()
export class TicketService {
    private readonly logger: Logger = new Logger(TicketService.name);

    constructor(
        @InjectModel(TicketModel.name) private ticketModel: Model<TicketDocument>,
        @InjectModel(FestivalModel.name) private festivalModel: Model<FestivalDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
    ) { }

    /**
     * Zie https://mongoosejs.com/docs/populate.html#population
     *
     * @returns
     */
    async findAll(): Promise<ITicket[]> {
        this.logger.log(`Finding all tickets`);
        const items = await this.ticketModel
            .find()
            .exec();
        return items;
    }

    async findOne(_id: string): Promise<ITicket | null> {
        this.logger.log(`finding ticket with id ${_id}`);
        const item = await this.ticketModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Ticket not found');
        }
        return item;
    }

    async create(ticketDto: CreateTicketDto, adminId: string): Promise<ITicket | null> {
        this.logger.log(`Create ticket ${ticketDto.name} requested by admin ${adminId}`);

        const festival = await this.festivalModel.findById(ticketDto.festivalId).exec();
        if (!festival) {
            this.logger.warn(`Festival ${ticketDto.festivalId} not found`);
            throw new HttpException(`Festival ${ticketDto.festivalId} not found`, 404);
        }

        const createdTicket = await this.ticketModel.create(ticketDto);

        return createdTicket;
    }

    async update(_id: string, ticket: UpdateTicketDto): Promise<ITicket | null> {
        this.logger.log(`Update ticket ${ticket.name}`);
        return this.ticketModel.findByIdAndUpdate({ _id }, ticket);
    }

    async delete(_id: string): Promise<ITicket | null> {
        this.logger.log(`Delete ticket with id ${_id}`);
        return this.ticketModel.findByIdAndDelete({ _id });
    }

    async purchaseTicket(ticketId: string, userId: string): Promise<ITicket | null> {
        this.logger.log(`Purchase ticket ${ticketId} for user ${userId}`);

        // Check if the ticket exists
        const ticket = await this.ticketModel.findOne({ _id: ticketId }).exec();
        if (!ticket) {
            this.logger.error(`Ticket with id ${ticketId} not found`);
            throw new HttpException('Ticket not found', 404);
        }

        // Check if ticket is already purchased
        if (ticket.userId) {
            this.logger.error(`Ticket with id ${ticketId} is already purchased`);
            throw new HttpException('Ticket is already purchased', 400);
        }

        // Fetch the festival corresponding to the ticket
        const festival = await this.festivalModel.findById(ticket.festivalId).exec();
        if (!festival) {
            this.logger.error(`Festival with id ${ticket.festivalId} not found`);
            throw new HttpException(`Festival not found`, 404);
        }

        // Check if the user exists
        const user = await this.userModel.findOne({ _id: userId }).exec();
        if (!user) {
            this.logger.error(`User with id ${userId} not found`);
            throw new HttpException('User not found', 404);
        }

        // Check if the festival is already embedded
        const alreadyAdded = user.festivals.some(
            (f: any) => f._id.toString() === festival._id.toString()
        );

        if (!alreadyAdded) {
            user.festivals.push(festival);
            await user.save();
        }

        // TODO: call naar neo4j om ticket toe te voegen met user in rcmnd-api

        // Update ticket with userId to assign the ticket to the user
        ticket.userId = userId;
        ticket.purchaseDate = new Date();

        const updatedTicket = await ticket.save();
        this.logger.log(`Ticket with id ${ticketId} purchased by user ${userId}`);

        return updatedTicket;
    }
}