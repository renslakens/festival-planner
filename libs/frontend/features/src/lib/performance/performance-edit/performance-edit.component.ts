import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PerformanceService } from '../performance.service';
import { ArtistService } from '../../artist/artist.service'; // Importeer ArtistService
import { IArtist } from '@festival-planner/shared/api';

@Component({
  selector: 'lib-performance-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './performance-edit.component.html',
})
export class PerformanceEditComponent implements OnInit {
  form: FormGroup;
  stageId: string | null = null;
  artists: IArtist[] = []; // Lijst voor de dropdown

  constructor(
    private fb: FormBuilder,
    private performanceService: PerformanceService,
    private artistService: ArtistService, // Injecteer
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      specialFeatures: [''],
      dateTime: [null, Validators.required], // Datum & Tijd
      period: [60, [Validators.required, Validators.min(15)]], // Duur in minuten
      artistId: ['', Validators.required], // De koppeling!
      stageId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // 1. Haal Stage ID uit URL (we komen van /stages/:stageId/performances/new)
    this.stageId = this.route.snapshot.paramMap.get('stageId');
    if (this.stageId) {
      this.form.patchValue({ stageId: this.stageId });
    }

    // 2. Haal Artiesten op voor de dropdown
    this.artistService.getArtists().subscribe(artists => {
      this.artists = artists;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.performanceService.createPerformance(this.form.value).subscribe({
        next: () => {
          // Navigeer terug (bv. naar het festival waar de stage bij hoort is lastig te weten zonder extra call,
          // dus we gaan 'back' of naar de festival lijst)
          window.history.back();
        },
        error: (err) => console.error('Fout:', err)
      });
    }
  }
}