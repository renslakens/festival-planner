import { Route } from '@angular/router';
import { AboutComponent, ArtistEditComponent, ArtistListComponent, authGuard, FestivalDetailComponent, FestivalEditComponent, HomeComponent, LoginComponent, PerformanceEditComponent, RegisterComponent, StageEditComponent, TicketEditComponent, TicketListComponent, TicketMyListComponent, UserDetailsComponent, UserEditComponent } from '@festival-planner/features';
import { FestivalListComponent } from '@festival-planner/features';

export const appRoutes: Route[] = [
    { path: '', component: HomeComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutComponent },

    { path: 'festivals', component: FestivalListComponent },
    { path: 'festivals/new', component: FestivalEditComponent, canActivate: [authGuard] },
    { path: 'festivals/:festivalId', component: FestivalDetailComponent },
    { path: 'festivals/:festivalId/stages/new', component: StageEditComponent, canActivate: [authGuard] },
    { path: 'festivals/:festivalId/edit', component: FestivalEditComponent, canActivate: [authGuard] },

    { path: 'stages/:stageId/edit', component: StageEditComponent, canActivate: [authGuard] },
    { path: 'stages/:stageId/performances/new', component: PerformanceEditComponent, canActivate: [authGuard] },

    { path: 'artists', component: ArtistListComponent },
    { path: 'artists/new', component: ArtistEditComponent, canActivate: [authGuard] },
    { path: 'artists/:artistId/edit', component: ArtistEditComponent, canActivate: [authGuard] },

    { path: 'tickets', component: TicketListComponent },
    { path: 'tickets/new', component: TicketEditComponent, canActivate: [authGuard] },
    { path: 'tickets/:ticketId/edit', component: TicketEditComponent, canActivate: [authGuard] },
    { path: 'tickets/my', component: TicketMyListComponent, canActivate: [authGuard] },

    { path: 'profile', component: UserDetailsComponent, canActivate: [authGuard] },
    { path: 'profile/:userId/edit', component: UserEditComponent, canActivate: [authGuard] },
];