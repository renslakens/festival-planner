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
  artists: IArtist[] = [];

  constructor(
    private fb: FormBuilder,
    private performanceService: PerformanceService,
    private artistService: ArtistService,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      specialFeatures: [''],
      dateTime: [null, Validators.required],
      period: [60, [Validators.required, Validators.min(15)]],
      artistId: ['', Validators.required],
      stageId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.stageId = this.route.snapshot.paramMap.get('stageId');
    if (this.stageId) {
      this.form.patchValue({ stageId: this.stageId });
    }

    this.artistService.getArtists().subscribe(artists => {
      this.artists = artists;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.performanceService.createPerformance(this.form.value).subscribe({
        next: () => {
          window.history.back();
        },
        error: (err) => console.error('Fout:', err)
      });
    }
  }
}