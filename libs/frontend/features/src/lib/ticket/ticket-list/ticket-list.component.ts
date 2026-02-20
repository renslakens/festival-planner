import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../ticket.service';
import { ITicket } from '@festival-planner/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'lib-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent implements OnInit {
  tickets: ITicket[] = [];
  isLoggedIn = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check of gebruiker is ingelogd (zodat we de "Koop" knop kunnen tonen/verbergen)
    if (this.authService.getLoggedInUserId()) {
      console.debug('Gebruiker is ingelogd, userId:', this.authService.getLoggedInUserId());
      this.isLoggedIn = true;
    }

    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (results) => this.tickets = results,
      error: (err) => console.error('Fout bij ophalen tickets', err)
    });
  }

  buyTicket(ticketId: string): void {
    if (!this.isLoggedIn) {
      this.errorMessage = "Je moet ingelogd zijn om een ticket te kopen.";
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.ticketService.purchaseTicket(ticketId).subscribe({
      next: (purchasedTicket) => {
        this.successMessage = "Ticket succesvol gekocht! Veel plezier!";
        // Optioneel: herlaad tickets als er een 'voorraad' is die afneemt
        // this.loadTickets(); 
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Er is iets misgegaan bij het kopen van het ticket.";
      }
    });
  }
}