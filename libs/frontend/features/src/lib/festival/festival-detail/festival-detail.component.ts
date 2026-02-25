import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FestivalService } from '../festival.service';
import { IFestival, IStage, ITicket } from '@festival-planner/shared/api';
import { AuthService, StageService, TicketService } from '@festival-planner/features';
import { TicketListComponent } from '../../ticket/ticket-list/ticket-list.component';

@Component({
  selector: 'lib-festival-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TicketListComponent],
  templateUrl: './festival-detail.component.html',
  styleUrls: ['./festival-detail.component.css'],
})
export class FestivalDetailComponent implements OnInit {
  festival: IFestival | null = null;
  stages: IStage[] = [];
  isAdmin = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private festivalService: FestivalService,
    private stageService: StageService,
    private ticketService: TicketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    const user = this.authService.getCurrentUser();
    this.isLoggedIn = !!user;
    this.isAdmin = user?.role === 'Admin';

    if (id) {
      this.festivalService.getFestivalById(id).subscribe({
        next: (data) => this.festival = data,
        error: (err) => {
          console.error('Error loading festival', err);
        }
      });

      this.stageService.getStagesByFestivalId(id).subscribe({
        next: (data) => this.stages = data,
        error: (err) => {
          console.error('Error loading stages', err);
        }
      });
    }
  };
}