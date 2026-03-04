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
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private festivalService: FestivalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [50, [Validators.required, Validators.min(0)]],
      festivalId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const ticketId = params.get('ticketId');
      if (ticketId) {
        this.ticketService.getTicketById(ticketId).subscribe({
          next: (ticket) => {
            this.form.patchValue({
              name: ticket.name,
              price: ticket.price,
              festivalId: ticket.festivalId
            });
            this.isEditMode = true;
          },
          error: (err) => console.error('Error loading ticket', err)
        });
      }
    });

    this.festivalService.getFestivals().subscribe({
      next: (response) => this.festivals = response || [],
      error: (err) => console.error('Fout bij ophalen festivals', err)
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      if (this.isEditMode) {
        this.ticketService.updateTicket(this.route.snapshot.params['ticketId'], this.form.value).subscribe({
          next: () => this.router.navigate(['/tickets']),
          error: (err) => console.error(err)
        });
      } else {
        this.ticketService.createTicket(this.form.value).subscribe({
          next: () => this.router.navigate(['/tickets']),
          error: (err) => console.error(err)
        });
      }
    }
  }
}