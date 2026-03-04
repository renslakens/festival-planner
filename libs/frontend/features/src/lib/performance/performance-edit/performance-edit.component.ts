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
  performanceId: string | null = null;
  artists: IArtist[] = [];
  errorMessage: string | null = null;
  isEditMode = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private performanceService: PerformanceService,
    private artistService: ArtistService,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      specialFeatures: ['', Validators.required],
      dateTime: [null, Validators.required],
      period: [60, [Validators.required, Validators.min(15)]],
      artistId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check of we in edit-mode zijn
    this.route.paramMap.subscribe((params) => {
      this.performanceId = params.get('performanceId');
      if (this.performanceId) {
        this.isEditMode = true;
        this.loadPerformance(this.performanceId);
      }
    });

    this.artistService.getArtists().subscribe(artists => {
      this.artists = artists;
    });
  }

  loadPerformance(id: string): void {
    this.performanceService.getPerformanceById(id).subscribe({
      next: (performance) => {
        // Vul het formulier met de data
        this.form.patchValue({
          description: performance.description,
          specialFeatures: performance.specialFeatures,
          dateTime: this.formatDate(performance.dateTime),
          period: performance.period,
          artistId: performance.artistId
        });
      },
      error: (err) => console.error('Error loading performance', err),
    });
  }

  back(): void {
    window.history.back();
  }

  // Hulpfunctie om datum string (2024-12-15T00...) naar YYYY-MM-DD te zetten voor input
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {
      const formData = {
        ...this.form.value,
        stageId: this.stageId
      }

      this.performanceService.createPerformance(formData).subscribe({
        next: () => {
          this.back();
        },
        error: (err) => {
          console.error('Fout bij opslaan:', err);
          this.errorMessage = 'Opslaan mislukt. Check of alle velden zijn ingevuld.';
        }
      });
    } else {
      this.errorMessage = 'Formulier is ongeldig of Stage ID ontbreekt.';
    }
  }
}