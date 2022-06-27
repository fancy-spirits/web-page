import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { APIConnectorService } from '../apiconnector.service';
import { Artist } from '../entities';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.scss']
})
export class ArtistPageComponent implements OnInit {

  artists: Artist[] = [];

  addArtistModalVisible = false;

  constructor(private httpClient: HttpClient, private api: APIConnectorService) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  onNewArtist(){
    this.addArtistModalVisible = true;
  }

  loadArtists = () => {
    this.httpClient.get(this.api.generateURL("/artists"), {observe: "body"}, )
      .subscribe((body) => {
        this.artists = body as Artist[];
        console.log(this.artists);
        
      });
  }

  onArtistCreated = () => {
    this.loadArtists();
  }

}
