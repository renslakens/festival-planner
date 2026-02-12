import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistService } from '../artist.service';
import { IArtist } from '@festival-planner/shared/api';

@Component({
  selector: 'lib-artist-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artist-list.component.html',
})
export class ArtistListComponent implements OnInit {
  artists: IArtist[] = [];

  constructor(private artistService: ArtistService) { }

  ngOnInit(): void {
    this.artistService.getArtists().subscribe(results => this.artists = results);
  }
}