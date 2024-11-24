import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { IUserInfo, UserGender, UserRole } from '@avans-nx-workshop/shared/api';


@Injectable({
    providedIn: 'root',
})
export class UserService {
    users: IUserInfo[] = [
        {
            _id: '1',
            name: 'Nick Suijkerbuijk',
            emailAddress: 'n.suijkerbuijk@gmail.com',
            profileImgUrl: 'url',
            role: UserRole.Guest,
            gender: UserGender.Male,
            isActive: true,
            password: 'password'
        },
        {
            _id: '2',
            name: 'Rens Lakens',
            emailAddress: 'r.lakens@gmail.com',
            profileImgUrl: 'url',
            role: UserRole.Admin,
            gender: UserGender.Male,
            isActive: true,
            password: 'password'
        },
        {
            _id: '3',
            name: 'Gido Adriolo',
            emailAddress: 'g.adriolo@gmail.com',
            profileImgUrl: 'url',
            role: UserRole.Admin,
            gender: UserGender.Male,
            isActive: true,
            password: 'password'
        }
    ];
    constructor() {
        console.log('Service constructor aangeroepen');
    }

    getUsers(): IUserInfo[] {
        console.log('getUsers aangeroepen');
        return this.users;
    }

    getUsersAsObservable(): Observable<IUserInfo[]> {
        console.log('getUsersAsObservable aangeroepen');
        // 'of' is een rxjs operator die een Observable
        // maakt van de gegeven data.
        return of(this.users);
    }

    getUsersAsync(): Observable<IUserInfo[]> {
        console.log('getUsersAsync aangeroepen');
        return of(this.users).pipe(delay(2000));
    }


    getUserById(_id: string): IUserInfo {
        console.log('getUserById aangeroepen');
        return this.users.filter((user) => user._id === _id)[0];
    }
}