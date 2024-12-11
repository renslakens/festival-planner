import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    UserDocument,
    User as UserModel
} from '@festival-planner/backend/user';
import { IStage } from '@festival-planner/shared/api';
import { Stage as StageModel, StageDocument } from './stage.schema';
import { UpdateStageDto } from '@festival-planner/backend/dto';

@Injectable()
export class StageService {
    private readonly logger: Logger = new Logger(StageService.name);

    constructor(
        @InjectModel(StageModel.name) private stageModel: Model<StageDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
    ) {}

    /**
     * Zie https://mongoosejs.com/docs/populate.html#population
     *
     * @returns
     */
    async findAll(): Promise<IStage[]> {
        this.logger.log(`Finding all stages`);
        const items = await this.stageModel
            .find()
            //.populate('cook', 'name emailAddress gender isActive profileImgUrl')
            .exec();
        return items;
    }

    async findOne(_id: string): Promise<IStage | null> {
        this.logger.log(`finding stage with id ${_id}`);
        const item = await this.stageModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Stage not found');
        }
        return item;
    }

    async create(req: any): Promise<IStage | null> {
        const stage = req.body;
        const user_id = req.user.user_id;

        if (stage && user_id) {
            this.logger.log(`Create stage ${stage.name} for ${user_id}`);
            const user = await this.userModel
                .findOne({ _id: user_id })
                .select('-password -stages -role -__v -isActive')
                .exec();
            const createdItem = {
                ...stage,
                //cook: user
            };
            return this.stageModel.create(createdItem);
        }
        return null;
    }

    async update(_id: string, stage: UpdateStageDto): Promise<IStage | null> {
        this.logger.log(`Update stage ${stage.name}`);
        return this.stageModel.findByIdAndUpdate({ _id }, stage);
    }
}