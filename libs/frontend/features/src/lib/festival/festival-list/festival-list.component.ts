import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFestival } from '@festival-planner/shared/api';
import { FestivalService } from '../festival.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'festival-planner-festival-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './festival-list.component.html',
  styleUrls: ['./festival-list.component.css'],
})
export class FestivalListComponent implements OnInit, OnDestroy {
  festivals: IFestival[] = [];
  subscription: Subscription | undefined = undefined;
  isAdmin = false;

  searchQuery: string = '';
  showOnly18Plus: boolean = false;

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

  get filteredFestivals(): IFestival[] {
    return this.festivals.filter(festival => {
      const matchesSearch = festival.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        festival.location.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matches18Plus = this.showOnly18Plus ? festival.is18Plus === true : true;

      return matchesSearch && matches18Plus;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
