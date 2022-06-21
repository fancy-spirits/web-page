import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Artist } from '../entities';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.scss']
})
export class ArtistPageComponent implements OnInit {

  artists: Artist[] = [];

  addArtistModalVisible = false;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  onNewArtist(){
    this.addArtistModalVisible = true;
  }

  loadArtists = () => {
    this.httpClient.get("http://api:5000/artists", {observe: "body"}, )
      .subscribe((body) => this.artists = body as Artist[]);
  }

}
