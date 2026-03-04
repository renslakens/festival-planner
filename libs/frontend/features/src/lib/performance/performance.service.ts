import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { commonEnvironment } from '@festival-planner/util-env';
import { IPerformance } from '@festival-planner/shared/api';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PerformanceService {
    private apiUrl = `${commonEnvironment.apiUrl}/performances`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({ Authorization: `Bearer ${token || ''}` });
    }

    getPerformanceById(id: string): Observable<IPerformance> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    getPerformancesByStageId(stageId: string): Observable<IPerformance[]> {
        return this.http.get<any>(`${this.apiUrl}/stage/${stageId}`, { headers: this.getHeaders() });
    }

    createPerformance(data: IPerformance): Observable<IPerformance> {
        return this.http.post<any>(this.apiUrl, data, { headers: this.getHeaders() });
    }

    updatePerformance(id: string, data: IPerformance): Observable<IPerformance> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
    }

    deletePerformance(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}