import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFestival } from '@festival-planner/shared/api';
import { FestivalService } from '../festival.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'festival-planner-festival-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './festival-list.component.html',
  styleUrls: ['./festival-list.component.css'],
})
export class FestivalListComponent implements OnInit, OnDestroy {
  festivals: IFestival[] | null = null;
  subscription: Subscription | undefined = undefined;
  isAdmin = false;

  constructor(
    private festivalService: FestivalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getCurrentUser()?.role === 'Admin';

    this.subscription = this.festivalService.getFestivals().subscribe((response) => {
      console.log(`festivals returned: ${response}`);
      this.festivals = response;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
