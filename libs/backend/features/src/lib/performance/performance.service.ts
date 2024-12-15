import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Performance as PerformanceModel, PerformanceDocument } from './performance.schema';
import { Stage as StageModel, StageDocument } from '../stage/stage.schema';
import { Artist as ArtistModel, ArtistDocument } from '../artist/artist.schema';
import { IPerformance } from '@festival-planner/shared/api';
import { CreatePerformanceDto, UpdatePerformanceDto } from '@festival-planner/backend/dto';
import {
    UserDocument,
    User as UserModel
} from '@festival-planner/backend/user';

@Injectable()
export class PerformanceService {
    private readonly logger: Logger = new Logger(PerformanceService.name);

    constructor(
        @InjectModel(PerformanceModel.name) private performanceModel: Model<PerformanceDocument>,
        @InjectModel(StageModel.name) private stageModel: Model<StageDocument>,
        @InjectModel(ArtistModel.name) private artistModel: Model<ArtistDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
    ) {}

    /**
     * Zie https://mongoosejs.com/docs/populate.html#population
     *
     * @returns
     */
    async findAll(): Promise<IPerformance[]> {
        this.logger.log(`Finding all performances`);
        const items = await this.performanceModel
            .find()
            //.populate('cook', 'name emailAddress gender isActive profileImgUrl')
            .exec();
        return items;
    }

    async findOne(_id: string): Promise<IPerformance | null> {
        this.logger.log(`finding performance with id ${_id}`);
        const item = await this.performanceModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Performance not found');
        }
        return item;
    }

    async findPerformancesByStageId(stageId: string): Promise<IPerformance[]> {
        this.logger.log(`finding performances with stage id ${stageId}`);
        const items = await this.performanceModel.find({ stageId }).exec();
        if (!items) {
            this.logger.debug('Performances not found');
        }
        return items;
    }

    async create(req: any): Promise<IPerformance | null> {
        const performance = req.body;
        const user_id = req.user.user_id;

        if (performance && user_id) {
            const existingPerformance = await this.performanceModel.findOne({ description: performance.description }).exec();
            if (existingPerformance) {
                this.logger.warn(`Performance ${performance.description} already exists`);
                throw new HttpException(`Performance ${performance.description} already exists`, 400);
            }

            // Check if stage exists
            const stage = await this.stageModel.findOne({ _id: performance.stageId }).exec();
            if (!stage) {
                this.logger.warn(`Stage ${performance.stageId} does not exist`);
                throw new HttpException(`Stage ${performance.stageId} does not exist`, 400);
            }

            // Check if artist exists
            const artist = await this.artistModel.findOne({ _id: performance.artistId }).exec();
            if (!artist) {
                this.logger.warn(`Artist ${performance.artistId} does not exist`);
                throw new HttpException(`Artist ${performance.artistId} does not exist`, 400);
            }

            this.logger.log(`Creating performance with description ${performance.description} for ${user_id}`);
            const user = await this.userModel
                .findOne({ _id: user_id })
                .select('-password -performances -role -__v -isActive')
                .exec();
            const createdItem = {
                ...performance,
                //cook: user
            };

            const createdPerformance = await this.performanceModel.create(createdItem);

            // Add performance to stage
            await this.stageModel.updateOne(
                { _id: performance.stageId },
                { $push: { performances: createdPerformance._id } }
            );

            return createdPerformance;
        }
        return null;
    }

    async update(_id: string, performance: UpdatePerformanceDto): Promise<IPerformance | null> {
        this.logger.log(`Update performance with description ${performance.description}`);
        return this.performanceModel.findByIdAndUpdate({ _id }, performance);
    }

    async delete(_id: string): Promise<IPerformance | null> {
        this.logger.log(`Delete performance with id ${_id}`);
        return this.performanceModel.findByIdAndDelete({ _id });
    }
}