import { Route } from '@angular/router';
import { AboutComponent } from '../../../../libs/frontend/features/src/lib/about/about.component';
import { FestivalListComponent } from '../../../../libs/frontend/features/src/lib/festival/festival-list/festival-list.component';

export const appRoutes: Route[] = [
    { path: 'about', component: AboutComponent },
    { path: 'festivals', component: FestivalListComponent },
];