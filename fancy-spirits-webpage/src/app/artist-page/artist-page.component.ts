import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.scss']
})
export class ArtistPageComponent implements OnInit {
  artistName = "doxbleK";
  artistPicture = "../../assets/doxblek.jpeg";
  biography = `<p>doxbleK is a world-wide known versatile artist mostly known for his Drum & Bass releases. Together with Jon Kat he majorly influenced that genre...</p>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias mollitia pariatur illum voluptates labore consectetur ex beatae rem deleniti, ut suscipit sunt doloribus. Quam beatae rem nulla ullam minima debitis.
  </p>`;
  genres = ["Drum & Bass", "House", "Electro"];

  constructor() { }

  ngOnInit(): void {
  }

}
