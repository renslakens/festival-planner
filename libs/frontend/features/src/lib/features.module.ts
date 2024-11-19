import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FestivalListComponent } from './festival/festival-list/festival-list.component';
import { FestivalDetailComponent } from './festival/festival-detail/festival-detail.component';

import { FestivalService } from './festival/festival.service';
import { AboutComponent } from './about/about.component';

@NgModule({
    imports: [
        CommonModule, FestivalDetailComponent, AboutComponent
    ],
    declarations: [FestivalListComponent],
    providers: [FestivalService],
    exports: [FestivalListComponent, FestivalDetailComponent, AboutComponent]
})
export class FeaturesModule { }