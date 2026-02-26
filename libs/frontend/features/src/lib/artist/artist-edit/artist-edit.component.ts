import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArtistService } from '../artist.service';

@Component({
  selector: 'lib-artist-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './artist-edit.component.html',
})
export class ArtistEditComponent implements OnInit {
  artistForm: FormGroup;
  isEditMode = false;
  artistId: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.artistForm = this.fb.group({
      name: ['', Validators.required],
      genre: ['', Validators.required],
      description: ['', Validators.required],
      popularity: [50, [Validators.min(0), Validators.max(10000000)]]
    });
  }

  ngOnInit(): void {
    this.artistId = this.route.snapshot.paramMap.get('artistId');
    if (this.artistId) {
      this.isEditMode = true;
      this.artistService.getArtistById(this.artistId).subscribe(artist => {
        this.artistForm.patchValue(artist);
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.artistForm.invalid) {
      return;
    }

    if (this.artistForm.valid) {
      const data = this.artistForm.value;
      const req = this.isEditMode && this.artistId
        ? this.artistService.updateArtist(this.artistId, data)
        : this.artistService.createArtist(data);

      req.subscribe(() => this.router.navigate(['/artists']));
    }
  }
}