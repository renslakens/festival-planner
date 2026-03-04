import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { commonEnvironment } from '@festival-planner/util-env';
import { IArtist } from '@festival-planner/shared/api';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ArtistService {
    private apiUrl = `${commonEnvironment.apiUrl}/artists`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            Authorization: `Bearer ${token || ''}`,
        });
    }

    getArtists(): Observable<IArtist[]> {
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
    }

    getArtistById(id: string): Observable<IArtist> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createArtist(artist: IArtist): Observable<IArtist> {
        return this.http.post<any>(this.apiUrl, artist, { headers: this.getHeaders() });
    }

    updateArtist(id: string, artist: IArtist): Observable<IArtist> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, artist, { headers: this.getHeaders() });
    }

    deleteArtist(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}