import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FestivalService } from '../festival.service';
import { IFestival, IStage } from '@festival-planner/shared/api';
import { AuthService, StageService } from '@festival-planner/features';

@Component({
  selector: 'lib-festival-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './festival-detail.component.html',
  styleUrls: ['./festival-detail.component.css'],
})
export class FestivalDetailComponent implements OnInit {
  festival: IFestival | null = null;
  stages: IStage[] = [];
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private festivalService: FestivalService,
    private stageService: StageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    const user = this.authService.getCurrentUser();
    console.log('Current user:', user);
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
  }
}