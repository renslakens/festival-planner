import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FestivalService } from '../festival.service';
import { IArtist, IFestival, IPerformance, IStage, ITicket } from '@festival-planner/shared/api';
import { ArtistService, AuthService, PerformanceService, StageService, TicketService } from '@festival-planner/features';
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
  performancesByStage: { [stageId: string]: any[] } = {};
  isAdmin = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private festivalService: FestivalService,
    private stageService: StageService,
    private performanceService: PerformanceService,
    private artistService: ArtistService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    const user = this.authService.getCurrentUser();
    this.isLoggedIn = !!user;
    this.isAdmin = user?.role === 'Admin';

    if (id) {
      this.festivalService.getFestivalById(id).subscribe(data => this.festival = data);

      this.stageService.getStagesByFestivalId(id).subscribe(stages => {
        this.stages = stages;

        stages.forEach(stage => {
          this.performanceService.getPerformancesByStageId(stage._id).subscribe(perfs => {
            this.performancesByStage[stage._id] = perfs.sort((a: any, b: any) =>
              new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            );
          });
        });
      });
    }
  }
}