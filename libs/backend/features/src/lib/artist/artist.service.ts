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

@Injectable()
export class ArtistService {
    private readonly logger: Logger = new Logger(ArtistService.name);

    constructor(
        @InjectModel(ArtistModel.name) private artistModel: Model<ArtistDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
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

    async create(artistDto: CreateArtistDto): Promise<IArtist | null> {
        // Check of artiest al bestaat
        const existing = await this.artistModel.findOne({ name: artistDto.name }).exec();
        if (existing) {
            throw new HttpException(`Artist ${artistDto.name} already exists`, 400);
        }
        return this.artistModel.create(artistDto);
    }

    async update(_id: string, artist: UpdateArtistDto): Promise<IArtist | null> {
        this.logger.log(`Update artist ${artist.name}`);
        return this.artistModel.findByIdAndUpdate({ _id }, artist);
    }

    async delete(_id: string): Promise<IArtist | null> {
        this.logger.log(`Delete artist with id ${_id}`);
        return this.artistModel.findByIdAndDelete({ _id });
    }
}