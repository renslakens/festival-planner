import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { commonEnvironment } from '@festival-planner/util-env';
import { IStage } from '@festival-planner/shared/api';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class StageService {
    private apiUrl = `${commonEnvironment.apiUrl}/stages`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            Authorization: `Bearer ${token || ''}`,
        });
    }

    getStages(): Observable<IStage[]> {
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
    }

    getStageById(id: string): Observable<IStage> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    getStagesByFestivalId(festivalId: string): Observable<IStage[]> {
        const url = `${this.apiUrl}/festival/${festivalId}`;
        return this.http.get<any>(url, { headers: this.getHeaders() });
    }

    createStage(stage: IStage): Observable<IStage> {
        return this.http.post<IStage>(this.apiUrl, stage, { headers: this.getHeaders() });
    }

    updateStage(id: string, stage: IStage): Observable<IStage> {
        return this.http.put<IStage>(`${this.apiUrl}/${id}`, stage, { headers: this.getHeaders() });
    }

    deleteStage(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}