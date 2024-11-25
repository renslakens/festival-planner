import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Festival as FestivalModel, FestivalDocument } from './festival.schema';
import { IFestival } from '@festival-planner/shared/api';
import { CreateFestivalDto, UpdateFestivalDto } from '@festival-planner/backend/dto';
import {
    UserDocument,
    User as UserModel
} from '@festival-planner/backend/user';

@Injectable()
export class FestivalService {
    private readonly logger: Logger = new Logger(FestivalService.name);

    constructor(
        @InjectModel(FestivalModel.name) private festivalModel: Model<FestivalDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
    ) {}

    /**
     * Zie https://mongoosejs.com/docs/populate.html#population
     *
     * @returns
     */
    async findAll(): Promise<IFestival[]> {
        this.logger.log(`Finding all festivals`);
        const items = await this.festivalModel
            .find()
            //.populate('cook', 'name emailAddress gender isActive profileImgUrl')
            .exec();
        return items;
    }

    async findOne(_id: string): Promise<IFestival | null> {
        this.logger.log(`finding festival with id ${_id}`);
        const item = await this.festivalModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Festival not found');
        }
        return item;
    }

    async create(req: any): Promise<IFestival | null> {
        const festival = req.body;
        const user_id = req.user.user_id;

        if (festival && user_id) {
            this.logger.log(`Create festival ${festival.name} for ${user_id}`);
            const user = await this.userModel
                .findOne({ _id: user_id })
                .select('-password -festivals -role -__v -isActive')
                .exec();
            const createdItem = {
                ...festival,
                //cook: user
            };
            return this.festivalModel.create(createdItem);
        }
        return null;
    }

    async update(_id: string, festival: UpdateFestivalDto): Promise<IFestival | null> {
        this.logger.log(`Update festival ${festival.name}`);
        return this.festivalModel.findByIdAndUpdate({ _id }, festival);
    }
}