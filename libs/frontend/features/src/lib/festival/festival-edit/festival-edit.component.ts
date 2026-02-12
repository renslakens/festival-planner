import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FestivalService } from '../festival.service';
import { IFestival } from '@festival-planner/shared/api';

@Component({
  selector: 'lib-festival-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './festival-edit.component.html',
  styleUrl: './festival-edit.component.css',
})
export class FestivalEditComponent implements OnInit {
  festivalForm: FormGroup;
  isEditMode = false;
  festivalId: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private festivalService: FestivalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Definieer het formulier
    this.festivalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      date: [null, Validators.required],
      location: ['', Validators.required],
      is18Plus: [false], // Checkbox
    });
  }

  ngOnInit(): void {
    // Check of we in edit-mode zijn
    this.route.paramMap.subscribe((params) => {
      this.festivalId = params.get('id');
      if (this.festivalId) {
        this.isEditMode = true;
        this.loadFestival(this.festivalId);
      }
    });
  }

  loadFestival(id: string): void {
    this.festivalService.getFestivalById(id).subscribe({
      next: (festival) => {
        // Vul het formulier met de data
        // Let op: datum moet soms geformatteerd worden voor <input type="date">
        this.festivalForm.patchValue({
          name: festival.name,
          description: festival.description,
          location: festival.location,
          is18Plus: festival.is18Plus,
          // Als date een string is, direct gebruiken. Als Date object: .toISOString().split('T')[0]
          date: this.formatDate(festival.date)
        });
      },
      error: (err) => console.error('Error loading festival', err),
    });
  }

  // Hulpfunctie om datum string (2024-12-15T00...) naar YYYY-MM-DD te zetten voor input
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.festivalForm.invalid) {
      return;
    }

    const formData = this.festivalForm.value;

    if (this.isEditMode && this.festivalId) {
      // UPDATE
      this.festivalService.updateFestival(this.festivalId, formData).subscribe({
        next: () => this.router.navigate(['/festivals', this.festivalId]),
        error: (err) => console.error('Update failed', err),
      });
    } else {
      // CREATE
      this.festivalService.createFestival(formData).subscribe({
        next: () => this.router.navigate(['/festivals']),
        error: (err) => console.error('Create failed', err),
      });
    }
  }
}