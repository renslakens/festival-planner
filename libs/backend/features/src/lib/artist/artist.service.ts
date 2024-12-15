import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    UserDocument,
    User as UserModel
} from '@festival-planner/backend/user';
import { IArtist } from '@festival-planner/shared/api';
import { Artist as ArtistModel, ArtistDocument } from './artist.schema';
import { UpdateArtistDto } from '@festival-planner/backend/dto';

@Injectable()
export class ArtistService {
    private readonly logger: Logger = new Logger(ArtistService.name);

    constructor(
        @InjectModel(ArtistModel.name) private artistModel: Model<ArtistDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
    ) {}

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

    async create(req: any): Promise<IArtist | null> {
        const artist = req.body;
        const user_id = req.user.user_id;

        if (artist && user_id) {
            const existingArtist = await this.artistModel.findOne({ name: artist.name }).exec();
            if (existingArtist) {
                this.logger.warn(`Artist ${artist.name} already exists`);
                throw new HttpException(`Artist ${artist.name} already exists`, 400);
            }

            this.logger.log(`Create artist ${artist.name} for ${user_id}`);
            const user = await this.userModel
                .findOne({ _id: user_id })
                .select('-password -artists -role -__v -isActive')
                .exec();
            const createdItem = {
                ...artist,
                //cook: user
            };
            return this.artistModel.create(createdItem);
        }
        return null;
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