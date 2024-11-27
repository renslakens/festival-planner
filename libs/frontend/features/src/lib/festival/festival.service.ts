import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFestival, IFestivalResponse, FestivalListResponse } from '@festival-planner/shared/api';
import { AuthService } from '@festival-planner/features';

@Injectable({
    providedIn: 'root',
})
export class FestivalService {
    private apiUrl = `${process.env['dataApiUrl']}/festival`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private createAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        console.log
        if (!token) {
            console.error('No JWT token found');
        }
        console.log('found token ' + token)
        return new HttpHeaders({
            Authorization: `Bearer ${token || ''}`, // Voeg token toe aan de header
        }
        );
    }

    getFestivals(): Observable<FestivalListResponse> {
        const headers = this.createAuthHeaders();
        return this.http.get<FestivalListResponse>(this.apiUrl, { headers });
    }

    getFestivalById(id: string): Observable<IFestivalResponse> {
        const headers = this.createAuthHeaders();
        return this.http.get<IFestivalResponse>(`${this.apiUrl}/${id}`, { headers });
    }

    createFestival(festival: IFestival): Observable<IFestival> {
        const headers = this.createAuthHeaders();
        console.log('Sending festival to backend:', festival);
        return this.http.post<IFestival>(this.apiUrl, festival, { headers });
    }

    updateFestival(id: string, festival: IFestival): Observable<IFestival> {
        const headers = this.createAuthHeaders();
        return this.http.put<IFestival>(`${this.apiUrl}/${id}`, festival, { headers });
    }

    deleteFestival(id: string): Observable<void> {
        const headers = this.createAuthHeaders();
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
    }
}

export default FestivalService;