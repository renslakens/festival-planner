import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../ticket.service';
import { FestivalService } from '../../festival/festival.service';
import { ITicket, IFestival } from '@festival-planner/shared/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-ticket-my-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ticket-my-list.component.html',
})
export class TicketMyListComponent implements OnInit {
  myTickets: ITicket[] = [];
  festivals: IFestival[] = [];

  constructor(
    private ticketService: TicketService,
    private festivalService: FestivalService
  ) { }

  ngOnInit(): void {
    // Haal festivals op voor de namen
    this.festivalService.getFestivals().subscribe({
      next: (response: any) => {
        this.festivals = Array.isArray(response) ? response : [];
      }
    });

    // Haal persoonlijke tickets op
    this.ticketService.getMyTickets().subscribe({
      next: (results) => this.myTickets = results,
      error: (err) => console.error('Fout bij ophalen van mijn tickets', err)
    });
  }

  getFestivalName(festivalId: string): string {
    const festival = this.festivals.find(f => f._id === festivalId);
    return festival ? festival.name : 'Onbekend Festival';
  }
}