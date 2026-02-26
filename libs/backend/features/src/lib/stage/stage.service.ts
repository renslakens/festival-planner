import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    UserDocument,
    User as UserModel
} from '@festival-planner/backend/user';
import { IStage } from '@festival-planner/shared/api';
import { Stage as StageModel, StageDocument } from './stage.schema';
import { Festival as FestivalModel } from '../festival/festival.schema';
import { CreateStageDto, UpdateStageDto } from '@festival-planner/backend/dto';
import { FestivalDocument } from '../festival/festival.schema';

@Injectable()
export class StageService {
    private readonly logger: Logger = new Logger(StageService.name);

    constructor(
        @InjectModel(StageModel.name) private stageModel: Model<StageDocument>,
        @InjectModel(FestivalModel.name) private festivalModel: Model<FestivalDocument>
    ) { }

    /**
     * Zie https://mongoosejs.com/docs/populate.html#population
     *
     * @returns
     */
    async findAll(): Promise<IStage[]> {
        this.logger.log(`Finding all stages`);
        const items = await this.stageModel
            .find()
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

    async findStagesByFestivalId(festivalId: string): Promise<IStage[]> {
        this.logger.log(`finding stages with festival id ${festivalId}`);
        const items = await this.stageModel.find({ festivalId }).exec();
        if (!items) {
            this.logger.debug('Stages not found');
        }
        return items;
    }

    async create(stageDto: CreateStageDto, userId: string): Promise<IStage | null> {
        this.logger.log(`Create stage ${stageDto.name} requested by ${userId}`);

        // 1. Check of podium naam al bestaat
        const existingStage = await this.stageModel.findOne({ name: stageDto.name }).exec();
        if (existingStage) {
            this.logger.warn(`Stage ${stageDto.name} already exists`);
            throw new HttpException(`Stage ${stageDto.name} already exists`, 400);
        }

        // 2. Check of festival bestaat
        const festival = await this.festivalModel.findOne({ _id: stageDto.festivalId }).exec();
        if (!festival) {
            this.logger.warn(`Festival ${stageDto.festivalId} not found`);
            throw new HttpException(`Festival ${stageDto.festivalId} not found`, 404);
        }

        // 3. Maak podium aan
        const createdStage = await this.stageModel.create({ ...stageDto, ownerId: userId });

        // 4. Koppel podium aan festival
        await this.festivalModel.findByIdAndUpdate(stageDto.festivalId,
            { $push: { stages: createdStage._id } }
        );

        return createdStage;
    }

    async update(_id: string, stage: UpdateStageDto, ownerId: string): Promise<IStage | null> {
        this.logger.log(`Update stage ${stage.name}`);
        return this.stageModel.findByIdAndUpdate({ _id, ownerId }, stage, { new: true });
    }

    async delete(_id: string, ownerId: string): Promise<IStage | null> {
        const stageToDelete = await this.stageModel.findById(_id);
        if (!stageToDelete) {
            this.logger.warn(`Stage with id ${_id} not found`);
            throw new HttpException(`Stage with id ${_id} not found`, 404);
        }

        this.logger.log(`Delete stage with id ${_id}`);
        await this.festivalModel.findByIdAndUpdate(stageToDelete.festivalId, { $pull: { stages: stageToDelete._id } });
        return this.stageModel.findByIdAndDelete({ _id, ownerId });
    }
}