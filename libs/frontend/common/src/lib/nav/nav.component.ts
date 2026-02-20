import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '@festival-planner/features';

@Component({
  selector: 'festival-planner-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  isLoggedIn = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.getLoggedInUserId()) {
      console.debug('Gebruiker is ingelogd, userId:', this.authService.getLoggedInUserId());
      this.isLoggedIn = true;
    }
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.authService.clearToken();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}