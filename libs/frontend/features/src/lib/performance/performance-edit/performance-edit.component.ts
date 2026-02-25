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
  errorMessage: string | null = null;

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
      artistId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.stageId = this.route.snapshot.paramMap.get('id');
    if (this.stageId) {
      this.form.patchValue({ stageId: this.stageId });
    }

    this.artistService.getArtists().subscribe(artists => {
      this.artists = artists;
    });
  }

  back(): void {
    window.history.back();
  }

  onSubmit(): void {
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