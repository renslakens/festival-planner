import { Injectable, NotFoundException } from '@nestjs/common';
import { IFestival } from '@festival-planner/shared/api';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class FestivalService {
    TAG = 'FestivalService';

    private Festivals$ = new BehaviorSubject<IFestival[]>([
        {
            id: '0',
            name: 'Awakenings',
            description: 'Techno festival',
            date: new Date(),
            location: 'Amsterdam',
            is18Plus: true,
        },
    ]);

    getAll(): IFestival[] {
        Logger.log('getAll', this.TAG);
        return this.Festivals$.value;
    }

    getOne(id: string): IFestival {
        Logger.log(`getOne(${id})`, this.TAG);
        const Festival = this.Festivals$.value.find((td) => td.id === id);
        if (!Festival) {
            throw new NotFoundException(`Festival could not be found!`);
        }
        return Festival;
    }

    /**
     * Update the arg signature to match the DTO, but keep the
     * return signature - we still want to respond with the complete
     * object
     */
    create(Festival: Pick<IFestival, 'name' | 'description'>): IFestival {
        Logger.log('create', this.TAG);
        const current = this.Festivals$.value;
        // Use the incoming data, a randomized ID, and a default value of `false` to create the new to-do
        const newFestival: IFestival = {
            ...Festival,
            id: `Festival-${Math.floor(Math.random() * 10000)}`,
            date: new Date(),
            location: 'Amsterdam',
            is18Plus: true,
        };
        this.Festivals$.next([...current, newFestival]);
        return newFestival;
    }
}
