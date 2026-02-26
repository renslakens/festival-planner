import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StageService } from '../stage.service';
import { IStage } from '@festival-planner/shared/api';

@Component({
  selector: 'lib-stage-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './stage-edit.component.html',
  styleUrl: './stage-edit.component.css',
})
export class StageEditComponent implements OnInit {
  stageForm: FormGroup;
  isEditMode = false;
  stageId: string | null = null;
  festivalId: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private stageService: StageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stageForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      capacity: [null, [Validators.required, Validators.min(10)]],
      covered: [false], // Checkbox
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.stageId = params.get('stageId');
      this.festivalId = params.get('festivalId');
      if (this.stageId) {
        this.isEditMode = true;
        this.loadStage(this.stageId);
      }
    });
  }

  loadStage(id: string): void {
    this.stageService.getStageById(id).subscribe({
      next: (stage) => {
        this.stageForm.patchValue(stage);
      },
      error: (err) => console.error('Error loading stage', err),
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.stageForm.invalid) return;

    const formData = this.stageForm.value;

    if (this.isEditMode && this.stageId) {
      this.stageService.updateStage(this.stageId, formData).subscribe({
        next: () => {
          // Probeer terug te gaan naar de vorige pagina, of default naar festivals
          this.router.navigate(['/festivals']);
        },
        error: (err) => console.error('Update failed', err),
      });
    } else {
      // Create mode: Voeg festivalId toe aan de payload
      if (this.festivalId) {
        const newStage = { ...formData, festivalId: this.festivalId }; // Zorg dat je backend dit accepteert!
        this.stageService.createStage(newStage).subscribe({
          next: () => this.router.navigate(['/festivals', this.festivalId]),
          error: (err) => console.error('Create failed', err),
        });
      } else {
        console.error("Geen festival ID gevonden!");
      }
    }
  }
}