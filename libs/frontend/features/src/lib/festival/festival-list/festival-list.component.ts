import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFestival } from '@festival-planner/shared/api';
import { FestivalService } from '../festival.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'festival-planner-festival-list',
  templateUrl: './festival-list.component.html',
  styleUrl: './festival-list.component.css',
})
export class FestivalListComponent implements OnInit, OnDestroy {
  festivals: IFestival[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private festivalService: FestivalService) {}

  ngOnInit(): void {
    this.subscription = this.festivalService.list().subscribe((results) => {
      console.log(`festivals returned: ${results}`);
      this.festivals = results;
    })
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
  }
}
