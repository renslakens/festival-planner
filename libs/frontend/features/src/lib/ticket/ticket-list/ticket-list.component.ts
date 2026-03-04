import { Component, Input, OnInit } from '@angular/core';
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
  @Input() festivalId: string | null = null;

  tickets: ITicket[] = [];
  festivals: IFestival[] = [];
  isLoggedIn = false;
  isAdmin = false;
  isOwner = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private ticketService: TicketService,
    private festivalService: FestivalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.getLoggedInUserId()) {
      console.debug('Gebruiker is ingelogd, userId:', this.authService.getLoggedInUserId());
      this.isLoggedIn = true;
    }
    this.isAdmin = this.authService.getCurrentUser()?.role === 'Admin';

    this.loadFestivals();

    this.loadTickets();
  }

  loadTickets(): void {
    const request$ = this.festivalId
      ? this.ticketService.getTicketsByFestivalId(this.festivalId)
      : this.ticketService.getTickets();

    request$.subscribe({
      next: (results) => {
        this.tickets = results.filter(ticket => !ticket.userId);
        this.isOwner = results.some(ticket => ticket.ownerId === this.authService.getLoggedInUserId());
        console.debug('Tickets geladen:', this.tickets);
        console.debug('Is eigenaar van tickets:', this.isOwner);
      },
      error: (err) => console.error('Fout bij ophalen tickets', err)
    });
  }

  loadFestivals(): void {
    this.festivalService.getFestivals().subscribe({
      next: (response: IFestival[]) => {
        this.festivals = response || [];
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

  deleteTicket(ticketId: string): void {
    if (confirm('Weet je zeker dat je dit ticket wilt verwijderen?')) {
      this.ticketService.deleteTicket(ticketId).subscribe({
        next: () => {
          this.successMessage = "Ticket succesvol verwijderd.";
          this.loadTickets();
        },
        error: (err) => {
          console.error('Error deleting ticket', err);
          this.errorMessage = 'Er is een fout opgetreden bij het verwijderen van het ticket. Probeer het later opnieuw.';
        }
      });
    }
  }
}