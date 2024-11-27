import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FestivalListComponent } from './festival/festival-list/festival-list.component';
import { FestivalDetailComponent } from './festival/festival-detail/festival-detail.component';
import { FestivalService } from './festival/festival.service';
import { AboutComponent } from './about/about.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';

@NgModule({
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FestivalDetailComponent, AboutComponent, HttpClientModule],
    declarations: [
        UserDetailsComponent,
        UserListComponent,
        UserEditComponent,
        
        FestivalListComponent,
    ],
    providers: [
        FestivalService,
        AuthService,
        UserService,
    ],
    exports: [FestivalListComponent, FestivalDetailComponent, AboutComponent]
})
export class FeaturesModule { }