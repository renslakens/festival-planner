import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserCredentials, IUserIdentity } from '@festival-planner/shared/api';
import { jwtDecode } from 'jwt-decode';
import { commonEnvironment } from '@festival-planner/util-env';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = `${commonEnvironment.apiUrl}/auth`;
    private readonly tokenKey = 'authToken'; // Sleutel voor opslag in localStorage

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: IUserCredentials): Observable<IUserIdentity> {
        return new Observable((observer) => {
            this.http.post<IUserIdentity>(`${this.apiUrl}/login`, credentials).subscribe({
                next: (response: any) => {
                    const token = response.results?.token; // Haal het token uit de "results" object
                    if (token) {
                        this.setToken(token); // Sla het token op
                        console.log('Token opgeslagen:', token);
                        observer.next(response); // Geef alleen "results" door aan de observer
                    } else {
                        console.error('Geen token ontvangen in de respons');
                        observer.error('No token in response');
                    }
                },
                error: (err) => {
                    console.error('Login fout:', err);
                    observer.error(err);
                },
            });
        });
    }

    register(credentials: IUserCredentials): Observable<IUserIdentity> {
        return new Observable((observer) => {
            this.http.post<IUserIdentity>(`${this.apiUrl}/register`, credentials).subscribe({
                next: (response: any) => {
                    const token = response.results?.token;
                    if (token) {
                        this.setToken(token);
                        console.log('Token opgeslagen na registratie:', token);
                        observer.next(response);
                    } else {
                        console.error('Geen token ontvangen in de registratie respons');
                        observer.error('No token in registration response');
                    }
                },
                error: (err) => {
                    console.error('Registratie fout:', err);
                    observer.error(err);
                },
            });
        });
    }

    // Opslaan van het token
    private setToken(token: string): void {
        console.log('Token opslaan in localStorage:', token);
        localStorage.setItem(this.tokenKey, token);
    }

    // Ophalen van het token
    getToken(): string | null {
        const token = localStorage.getItem(this.tokenKey);
        console.log('Ophalen van token uit localStorage:', token);
        return token;
    }

    // Verwijderen van het token (bijvoorbeeld bij uitloggen)
    clearToken(): void {
        localStorage.removeItem(this.tokenKey);
        this.router.navigate(['/login']);
        console.log('Token verwijderd uit localStorage');
    }

    getCurrentUser(): IUserIdentity | null {
        const token = this.getToken();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                return decoded;
            } catch (error) {
                console.error('Fout bij het decoderen van het token:', error);
                return null;
            }
        }
        return null;
    }

    getLoggedInUserId(): string | null {
        const token = this.getToken();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                return decoded.user_id || null;
            } catch (error) {
                console.error('Fout bij het decoderen van het token:', error);
                return null;
            }
        }
        return null;
    }
}