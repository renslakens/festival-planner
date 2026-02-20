import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../ticket.service';
import { IFestival, IFestivalListResponse, ITicket } from '@festival-planner/shared/api';
import { AuthService } from '../../auth/auth.service';
import { FestivalService } from '@festival-planner/features';

@Component({
  selector: 'lib-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent implements OnInit {
  tickets: ITicket[] = [];
  festivals: IFestival[] = [];
  isLoggedIn = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private ticketService: TicketService,
    private festivalService: FestivalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check of gebruiker is ingelogd (zodat we de "Koop" knop kunnen tonen/verbergen)
    if (this.authService.getLoggedInUserId()) {
      console.debug('Gebruiker is ingelogd, userId:', this.authService.getLoggedInUserId());
      this.isLoggedIn = true;
    }

    this.loadFestivals();

    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (results) => this.tickets = results.filter(ticket => !ticket.userId),
      error: (err) => console.error('Fout bij ophalen tickets', err)
    });
  }

  loadFestivals(): void {
    this.festivalService.getFestivals().subscribe({
      next: (response: IFestivalListResponse) => {
        this.festivals = response.results || [];
      }
    });
  }

  getFestivalName(festivalId: string): string {
    const festival = this.festivals.find(f => f._id === festivalId);
    return festival ? festival.name : 'Onbekend Festival';
  }

  buyTicket(ticketId: string): void {
    if (!this.isLoggedIn) {
      this.errorMessage = "Je moet ingelogd zijn om een ticket te kopen.";
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.ticketService.purchaseTicket(ticketId).subscribe({
      next: () => {
        this.successMessage = "Ticket succesvol gekocht! Veel plezier!";
        this.loadTickets();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Er is iets misgegaan bij het kopen van het ticket.";
      }
    });
  }
}