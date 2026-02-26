import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TicketService } from '../ticket.service';
import { FestivalService } from '../../festival/festival.service';
import { IFestival } from '@festival-planner/shared/api';

@Component({
  selector: 'lib-ticket-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ticket-edit.component.html',
})
export class TicketEditComponent implements OnInit {
  form: FormGroup;
  festivals: IFestival[] = [];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private festivalService: FestivalService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [50, [Validators.required, Validators.min(0)]],
      festivalId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.festivalService.getFestivals().subscribe({
      next: (response) => {
        this.festivals = response.results;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.ticketService.createTicket(this.form.value).subscribe({
        next: () => this.router.navigate(['/tickets']),
        error: (err) => console.error(err)
      });
    }
  }
}