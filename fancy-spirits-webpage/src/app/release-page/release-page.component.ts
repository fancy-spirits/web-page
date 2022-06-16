import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-release-page',
  templateUrl: './release-page.component.html',
  styleUrls: ['./release-page.component.scss']
})
export class ReleasePageComponent implements OnInit {
  name = "Rebirth";
  artists = ["doxbleK", "Jon Kat"];
  artwork = "../../assets/Rebirth.png";
  genres = ["Drum & Bass", "Trap"];

  constructor() { }

  ngOnInit(): void {
  }

}
