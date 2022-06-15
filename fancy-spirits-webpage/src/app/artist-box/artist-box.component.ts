import { Component, OnInit } from '@angular/core';
import { faSpotify, faItunes, faYoutube, faSoundcloud } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-artist-box',
  templateUrl: './artist-box.component.html',
  styleUrls: ['./artist-box.component.scss']
})
export class ArtistBoxComponent implements OnInit {
  faSpotify = faSpotify
  faItunes = faItunes
  faYoutube = faYoutube
  faSoundcloud = faSoundcloud

  constructor() { }

  ngOnInit(): void {
  }

}
