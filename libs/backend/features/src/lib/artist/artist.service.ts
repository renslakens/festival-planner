import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    UserDocument,
    User as UserModel
} from '@festival-planner/backend/user';
import { IArtist } from '@festival-planner/shared/api';
import { Artist as ArtistModel, ArtistDocument } from './artist.schema';
import { CreateArtistDto, UpdateArtistDto } from '@festival-planner/backend/dto';
import { Performance as PerformanceModel, PerformanceDocument } from '../performance/performance.schema';
import { Stage as StageModel, StageDocument } from '../stage/stage.schema';

@Injectable()
export class ArtistService {
    private readonly logger: Logger = new Logger(ArtistService.name);

    constructor(
        @InjectModel(ArtistModel.name) private artistModel: Model<ArtistDocument>,
        @InjectModel(PerformanceModel.name) private performanceModel: Model<PerformanceDocument>,
        @InjectModel(StageModel.name) private stageModel: Model<StageDocument>,
    ) { }

    /**
     * Zie https://mongoosejs.com/docs/populate.html#population
     *
     * @returns
     */
    async findAll(): Promise<IArtist[]> {
        this.logger.log(`Finding all artists`);
        const items = await this.artistModel
            .find()
            //.populate('cook', 'name emailAddress gender isActive profileImgUrl')
            .exec();
        return items;
    }

    async findOne(_id: string): Promise<IArtist | null> {
        this.logger.log(`finding artist with id ${_id}`);
        const item = await this.artistModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Artist not found');
        }
        return item;
    }

    async create(artistDto: CreateArtistDto, ownerId: string): Promise<IArtist | null> {
        // Check of artiest al bestaat
        const existing = await this.artistModel.findOne({ name: artistDto.name }).exec();
        if (existing) {
            throw new HttpException(`Artist ${artistDto.name} already exists`, 400);
        }
        this.logger.log(`Create artist ${artistDto.name} for ${ownerId}`);
        return this.artistModel.create({ ...artistDto, ownerId });
    }

    async update(_id: string, artist: UpdateArtistDto, ownerId: string): Promise<IArtist | null> {
        const artistToUpdate = await this.artistModel.findById(_id);
        if (!artistToUpdate) {
            this.logger.warn(`Artist with id ${_id} not found`);
            throw new HttpException(`Artist with id ${_id} not found`, 404);
        }

        this.logger.debug(`user ${ownerId}`);
        this.logger.debug(`artistToUpdate.ownerId ${artistToUpdate.ownerId}`);

        const dbOwner = String(artistToUpdate.ownerId).trim();
        const requestOwner = String(ownerId).trim();

        if (dbOwner !== requestOwner) {
            this.logger.warn(`User ${requestOwner} is not the owner of artist ${_id}`);
            throw new HttpException(`User ${requestOwner} is not the owner of artist ${_id}`, 403);
        }

        this.logger.log(`Update artist ${artist.name}`);
        return this.artistModel.findByIdAndUpdate({ _id, ownerId }, artist);
    }

    async delete(_id: string, ownerId: string): Promise<IArtist | null> {
        const artistToDelete = await this.artistModel.findById(_id);

        if (!artistToDelete) {
            this.logger.warn(`Artist with id ${_id} not found`);
            throw new HttpException(`Artist with id ${_id} not found`, 404);
        }

        const dbOwner = String(artistToDelete.ownerId).trim();
        const requestOwner = String(ownerId).trim();

        if (dbOwner !== requestOwner) {
            this.logger.warn(`User ${requestOwner} is not the owner of artist ${_id}`);
            throw new HttpException(`Je bent niet de eigenaar van deze artiest`, 403);
        }

        this.logger.log(`Start verwijderen van artiest ${_id} en alle afhankelijkheden...`);

        const performancesToDelete = await this.performanceModel.find({ artistId: _id });

        const performanceIds = performancesToDelete.map(perf => perf._id);

        if (performanceIds.length > 0) {
            await this.stageModel.updateMany(
                { performances: { $in: performanceIds } },
                { $pullAll: { performances: performanceIds } }
            );
            this.logger.log(`Stage arrays netjes opgeschoond.`);

            await this.performanceModel.deleteMany({ artistId: _id });
            this.logger.log(`${performanceIds.length} optredens verwijderd.`);
        }

        this.logger.log(`Artiest ${_id} succesvol verwijderd.`);
        return this.artistModel.findByIdAndDelete(_id);
    }
}