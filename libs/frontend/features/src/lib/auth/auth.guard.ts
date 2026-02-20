import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check of de gebruiker een token heeft
    if (authService.getToken()) {
        return true; // Mag door!
    }

    // Niet ingelogd? Stuur naar login pagina
    router.navigate(['/login']);
    return false; // Route geblokkeerd
};