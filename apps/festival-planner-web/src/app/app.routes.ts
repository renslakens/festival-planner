import { Route } from '@angular/router';
import { AboutComponent, FestivalDetailComponent, LoginComponent } from '@festival-planner/features';
import { FestivalListComponent } from '@festival-planner/features';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'festivals', pathMatch: 'full' },

    { path: 'login', component: LoginComponent },
    { path: 'about', component: AboutComponent },
    { path: 'festivals', component: FestivalListComponent },
    { path: 'festivals/:id', component: FestivalDetailComponent },
];