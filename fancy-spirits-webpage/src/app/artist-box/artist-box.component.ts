import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { faSpotify, faItunes, faYoutube, faSoundcloud } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-artist-box',
  templateUrl: './artist-box.component.html',
  styleUrls: ['./artist-box.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArtistBoxComponent implements OnInit {
  faSpotify = faSpotify
  faItunes = faItunes
  faYoutube = faYoutube
  faSoundcloud = faSoundcloud

  @Input()
  artistImage: string = "";

  @Input()
  artistName: string = "";

  @Input()
  biography: string = "";

  @Input()
  genres: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
