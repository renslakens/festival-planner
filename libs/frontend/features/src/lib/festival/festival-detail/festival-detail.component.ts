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
  isOwner = false;
  isStageOwner = false;
  isPerformanceOwner = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private festivalService: FestivalService,
    private stageService: StageService,
    private performanceService: PerformanceService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('festivalId');

    const user = this.authService.getCurrentUser();
    this.isLoggedIn = !!user;
    this.isAdmin = user?.role === 'Admin';

    console.log('Current user:', user);

    if (id) {
      this.festivalService.getFestivalById(id).subscribe(data => {
        this.festival = data;
        this.isOwner = this.festival.ownerId === user?.user_id;
        console.log('isOwner:', this.isOwner);
      });

      this.stageService.getStagesByFestivalId(id).subscribe(stages => {
        this.stages = stages;
        this.isStageOwner = stages.some(stage => stage.ownerId === user?.user_id);
        console.log('isStageOwner:', this.isStageOwner);

        stages.forEach(stage => {
          this.performanceService.getPerformancesByStageId(stage._id).subscribe(perfs => {
            this.isPerformanceOwner = perfs.some(perf => perf.ownerId === user?.user_id);
            console.log('isPerformanceOwner:', this.isPerformanceOwner);

            this.performancesByStage[stage._id] = perfs.sort((a: any, b: any) =>
              new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            );
          });
        });
      });
    }
  }

  deleteFestival(): void {
    if (this.festival?._id) {
      if (confirm('Weet je zeker dat je dit festival wilt verwijderen?')) {
        this.festivalService.deleteFestival(this.festival._id).subscribe({
          next: () => {
            alert('Festival succesvol verwijderd.');
            this.router.navigate(['/festivals']);
          },
          error: (err) => {
            console.error('Error deleting festival', err);
            alert('Er is een fout opgetreden bij het verwijderen van het festival. Probeer het later opnieuw.');
          },
        });
      }
    } else {
      alert('Festival ID ontbreekt. Kan het festival niet verwijderen.');
    }
  }

  deleteStage(stageId: string): void {
    if (confirm('Weet je zeker dat je dit podium wilt verwijderen? Alle bijbehorende acts worden ook verwijderd.')) {
      this.stageService.deleteStage(stageId).subscribe({
        next: () => {
          alert('Podium succesvol verwijderd.');
          this.stages = this.stages.filter(s => s._id !== stageId);
          delete this.performancesByStage[stageId];
        },
        error: (err) => {
          console.error('Error deleting stage', err);
          alert('Er is een fout opgetreden bij het verwijderen van het podium. Probeer het later opnieuw.');
        }
      });
    }
  }

  deletePerformance(performanceId: string, stageId: string): void {
    if (confirm('Weet je zeker dat je deze act wilt verwijderen?')) {
      this.performanceService.deletePerformance(performanceId).subscribe({
        next: () => {
          alert('Act succesvol verwijderd.');
          this.performancesByStage[stageId] = this.performancesByStage[stageId].filter((p: any) => p._id !== performanceId);
        },
        error: (err) => {
          console.error('Error deleting performance', err);
          alert('Er is een fout opgetreden bij het verwijderen van de act. Probeer het later opnieuw.');
        }
      });
    }
  }
}