import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { commonEnvironment } from '@festival-planner/util-env';
import { ITicket } from '@festival-planner/shared/api';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TicketService {
    private apiUrl = `${commonEnvironment.apiUrl}/tickets`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({ Authorization: `Bearer ${token || ''}` });
    }

    getTickets(): Observable<ITicket[]> {
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
            map(res => res.results)
        );
    }

    getMyTickets(): Observable<ITicket[]> {
        const url = `${this.apiUrl}/my/all`;
        return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
            map(res => res.results)
        );
    }

    getTicketsByFestivalId(festivalId: string): Observable<ITicket[]> {
        const url = `${this.apiUrl}/festival/${festivalId}`;
        return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
            map(res => res.results)
        );
    }

    purchaseTicket(ticketId: string): Observable<ITicket> {
        const url = `${this.apiUrl}/${ticketId}/purchase`;
        // We sturen een lege body {} mee, omdat het een POST is
        return this.http.post<any>(url, {}, { headers: this.getHeaders() }).pipe(
            map(res => res.results)
        );
    }

    createTicket(ticket: ITicket): Observable<ITicket> {
        return this.http.post<any>(this.apiUrl, ticket, { headers: this.getHeaders() }).pipe(
            map(res => res.results)
        );
    }
}