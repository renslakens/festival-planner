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
    ) { }

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
        const items = await this.performanceModel.find({ stageId }).populate('artistId').exec();
        if (!items) {
            this.logger.debug('Performances not found');
        }
        return items;
    }

    async create(performanceDto: CreatePerformanceDto, userId: string): Promise<IPerformance | null> {
        this.logger.log(`Create performance requested by ${userId}`);

        const stage = await this.stageModel.findById(performanceDto.stageId).exec();
        if (!stage) throw new HttpException(`Stage not found`, 404);

        const artist = await this.artistModel.findById(performanceDto.artistId).exec();
        if (!artist) throw new HttpException(`Artist not found`, 404);

        const createdPerformance = await this.performanceModel.create({ ...performanceDto, dateTime: new Date(performanceDto.dateTime) });

        await this.stageModel.updateOne(
            { _id: performanceDto.stageId },
            { $push: { performances: createdPerformance._id } }
        );

        return createdPerformance;
    }

    async update(_id: string, performance: UpdatePerformanceDto): Promise<IPerformance | null> {
        this.logger.log(`Update performance with description ${performance.description}`);
        return this.performanceModel.findByIdAndUpdate({ _id }, { ...performance, dateTime: new Date(performance.dateTime) });
    }

    async delete(_id: string): Promise<IPerformance | null> {
        this.logger.log(`Delete performance with id ${_id}`);
        return this.performanceModel.findByIdAndDelete({ _id });
    }
}