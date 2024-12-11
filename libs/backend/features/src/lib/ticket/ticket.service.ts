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
import { UpdateTicketDto } from '@festival-planner/backend/dto';

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

    async create(req: any): Promise<ITicket | null> {
        const ticket = req.body;
        const user_id = req.user.user_id;

        if (ticket && user_id) {
            this.logger.log(`Create ticket ${ticket.name} for ${user_id}`);
            const user = await this.userModel
                .findOne({ _id: user_id })
                .select('-password -tickets -role -__v -isActive')
                .exec();
            const createdItem = {
                ...ticket,
                //cook: user
            };
            return this.ticketModel.create(createdItem);
        }
        return null;
    }

    async update(_id: string, ticket: UpdateTicketDto): Promise<ITicket | null> {
        this.logger.log(`Update ticket ${ticket.name}`);
        return this.ticketModel.findByIdAndUpdate({ _id }, ticket);
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
        const festival = await this.festivalModel.findById(ticket.festivalId).exec(); // Assuming you have a `FestivalModel`
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

        // Update ticket with userId to assign the ticket to the user
        ticket.userId = userId;
        ticket.purchaseDate = new Date();

        const updatedTicket = await ticket.save();
        this.logger.log(`Ticket with id ${ticketId} purchased by user ${userId}`);

        return updatedTicket;
    }
}