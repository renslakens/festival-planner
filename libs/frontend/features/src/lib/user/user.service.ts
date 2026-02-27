import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserIdentity, IUserInfo } from '@festival-planner/shared/api';
import { commonEnvironment } from '@festival-planner/util-env';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = `${commonEnvironment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<IUserInfo[]> {
        return this.http.get<IUserInfo[]>(this.apiUrl);
    }

    getUserById(id: string): Observable<IUserIdentity> {
        return this.http.get<IUserIdentity>(`${this.apiUrl}/${id}`);
    }

    updateUser(updatedUser: Partial<IUserInfo>): Observable<boolean> {
        return this.http.put<boolean>(`${this.apiUrl}/${updatedUser._id}`, updatedUser);
    }
}