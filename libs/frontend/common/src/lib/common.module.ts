import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavComponent } from './nav/nav.component';

@NgModule({
    imports: [
        CommonModule, NavComponent
    ],
    declarations: [],
    providers: [],
    exports: [NavComponent]
})
export class CommonComponentModule { }