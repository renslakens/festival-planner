import { Route } from '@angular/router';
import { AboutComponent, ArtistEditComponent, ArtistListComponent, authGuard, FestivalDetailComponent, FestivalEditComponent, LoginComponent, PerformanceEditComponent, RegisterComponent, StageEditComponent, TicketEditComponent, TicketListComponent, TicketMyListComponent } from '@festival-planner/features';
import { FestivalListComponent } from '@festival-planner/features';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'festivals', pathMatch: 'full' },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutComponent },

    { path: 'festivals', component: FestivalListComponent },
    { path: 'festivals/new', component: FestivalEditComponent, canActivate: [authGuard] },
    { path: 'festivals/:id', component: FestivalDetailComponent },
    { path: 'festivals/:id/stages/new', component: StageEditComponent, canActivate: [authGuard] },
    { path: 'festivals/:id/edit', component: FestivalEditComponent, canActivate: [authGuard] },

    { path: 'stages/:id/edit', component: StageEditComponent, canActivate: [authGuard] },
    { path: 'stages/:id/performances/new', component: PerformanceEditComponent, canActivate: [authGuard] },

    { path: 'artists', component: ArtistListComponent },
    { path: 'artists/new', component: ArtistEditComponent, canActivate: [authGuard] },
    { path: 'artists/:id/edit', component: ArtistEditComponent, canActivate: [authGuard] },

    { path: 'tickets', component: TicketListComponent },
    { path: 'tickets/new', component: TicketEditComponent, canActivate: [authGuard] },
    { path: 'tickets/:id/edit', component: TicketEditComponent, canActivate: [authGuard] },
    { path: 'tickets/my', component: TicketMyListComponent, canActivate: [authGuard] }
];