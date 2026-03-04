import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { TicketService } from '../../ticket/ticket.service';
import { FestivalService } from '../../festival/festival.service';
import { IUser, ITicket, IFestival, IUserIdentity } from '@festival-planner/shared/api';
import { UserService } from '@festival-planner/features';
import { TicketMyListComponent } from '../../ticket/ticket-my-list/ticket-my-list.component';

@Component({
    selector: 'lib-user-details',
    standalone: true,
    imports: [CommonModule, RouterModule, TicketMyListComponent],
    templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {
    currentUserId: string | null = null;
    currentUser: IUserIdentity | null = null;
    myTickets: ITicket[] = [];
    myFestivals: IFestival[] = [];

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private ticketService: TicketService,
        private festivalService: FestivalService
    ) { }

    ngOnInit(): void {
        this.currentUserId = this.authService.getCurrentUser()?.user_id || null;
        if (this.currentUserId) {
            this.userService.getUserById(this.currentUserId).subscribe({
                next: (response: any) => {
                    this.currentUser = response;
                },
                error: (err) => {
                    console.error('Fout bij ophalen user details:', err);
                }
            });
            this.ticketService.getMyTickets().subscribe({
                next: (tickets) => {
                    this.myTickets = tickets;
                    this.extractFestivalsFromTickets(tickets);
                },
                error: (err) => console.error('Fout bij ophalen tickets', err)
            });
        }
    }

    extractFestivalsFromTickets(tickets: ITicket[]): void {
        // Haal eerst ALLE festivals op om de namen/data te matchen
        this.festivalService.getFestivals().subscribe((response: any) => {
            const allFestivals: IFestival[] = response;

            // Zoek unieke festival ID's uit de tickets
            const uniqueFestivalIds = [...new Set(tickets.map(t => t.festivalId))];

            // Filter de volledige festival objecten eruit
            this.myFestivals = allFestivals.filter(f => uniqueFestivalIds.includes(f._id));
        });
    }

    onLogout(): void {
        this.authService.clearToken();
    }
}