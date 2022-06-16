import { Component, Input, OnInit } from '@angular/core';
import { faSpotify, faItunes, faDeezer, faSoundcloud, faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-release-box',
  templateUrl: './release-box.component.html',
  styleUrls: ['./release-box.component.scss']
})
export class ReleaseBoxComponent implements OnInit {
  faSpotify = faSpotify;
  faItunes = faItunes;
  faDeezer = faDeezer;
  faSoundcloud = faSoundcloud;
  faYoutube = faYoutube;

  @Input()
  artwork: string = "";

  @Input()
  releaseName: string = "";

  @Input()
  artists: string[] = [];

  @Input()
  releaseType: ReleaseType = "single";

  @Input()
  releaseDate: Date = new Date();

  @Input()
  genres: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  artworkToURL() {
    return `url("${this.artwork}")`;
  }

}

type ReleaseType = "album" | "single" | "ep";
