import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistService } from '../artist.service';
import { IArtist } from '@festival-planner/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'lib-artist-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artist-list.component.html',
})
export class ArtistListComponent implements OnInit {
  artists: IArtist[] = [];
  isAdmin = false;
  currentUserId: string | null = null;

  constructor(private artistService: ArtistService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getCurrentUser()?.role === 'Admin';
    this.currentUserId = this.authService.getCurrentUser()?.user_id || null;
    this.artistService.getArtists().subscribe(results => this.artists = results);
  }

  deleteArtist(id: string): void {
    if (confirm('Weet je zeker dat je deze artiest wilt verwijderen?')) {
      this.artistService.deleteArtist(id).subscribe(() => {
        this.artists = this.artists.filter(artist => artist._id !== id);
      });
    }
  }
}