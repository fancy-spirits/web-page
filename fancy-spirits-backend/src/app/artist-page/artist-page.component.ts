import { Component, OnInit } from '@angular/core';
import { Artist } from '../model/artist';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.scss']
})
export class ArtistPageComponent implements OnInit {

  artists: Artist[] = [{
    biography: "Lorem ipsum bla bla bla",
    id: "123",
    name: "doxbleK",
    picture: new Blob()
  },
  {
    biography: "Lorem ipsum bla bla bla",
    id: "123",
    name: "doxbleK",
    picture: new Blob()
  },
  {
    biography: "Lorem ipsum bla bla bla",
    id: "123",
    name: "doxbleK",
    picture: new Blob()
  },
  {
    biography: "Lorem ipsum bla bla bla",
    id: "123",
    name: "doxbleK",
    picture: new Blob()
  }];

  addArtistModalVisible = false;

  constructor() { }

  ngOnInit(): void {
  }

  onNewArtist(){
    this.addArtistModalVisible = true;
  }

}
