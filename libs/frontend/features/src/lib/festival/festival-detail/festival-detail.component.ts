import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FestivalService } from '../festival.service';
import { IFestival } from '@festival-planner/shared/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-festival-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './festival-detail.component.html',
  styleUrls: ['./festival-detail.component.css'],
})
export class FestivalDetailComponent implements OnInit {
  festival: IFestival | null = null;

  constructor(
    private route: ActivatedRoute,
    private festivalService: FestivalService
  ) { }

  ngOnInit(): void {
    // Haal ID uit URL (bv: /festivals/6759f220...)
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.festivalService.getFestivalById(id).subscribe({
        next: (data) => this.festival = data,
        error: (err) => {
          console.error('Error loading festival', err);
        }
      });
    }
  }
}