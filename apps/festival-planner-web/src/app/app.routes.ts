import { Route } from '@angular/router';
import { AboutComponent, ArtistEditComponent, ArtistListComponent, FestivalDetailComponent, FestivalEditComponent, LoginComponent, PerformanceEditComponent, StageEditComponent, TicketEditComponent, TicketListComponent } from '@festival-planner/features';
import { FestivalListComponent } from '@festival-planner/features';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'festivals', pathMatch: 'full' },

    { path: 'login', component: LoginComponent },
    { path: 'about', component: AboutComponent },

    { path: 'festivals', component: FestivalListComponent },
    { path: 'festivals/new', component: FestivalEditComponent },
    { path: 'festivals/:id', component: FestivalDetailComponent },
    { path: 'festivals/:id/stages/new', component: StageEditComponent },
    { path: 'festivals/:id/edit', component: FestivalEditComponent },

    { path: 'stages/:id/edit', component: StageEditComponent },
    { path: 'stages/:id/performances/new', component: PerformanceEditComponent },

    { path: 'artists', component: ArtistListComponent },
    { path: 'artists/new', component: ArtistEditComponent },
    { path: 'artists/:id/edit', component: ArtistEditComponent },

    { path: 'tickets', component: TicketListComponent },
    { path: 'tickets/new', component: TicketEditComponent },
    { path: 'tickets/:id/edit', component: TicketEditComponent }
];