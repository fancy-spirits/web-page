import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { APIConnectorService } from '../apiconnector.service';
import { Artist, Base64String } from '../entities';

@Component({
  selector: 'app-add-artist-modal',
  templateUrl: './add-artist-modal.component.html',
  styleUrls: ['./add-artist-modal.component.scss']
})
export class AddArtistModalComponent implements OnInit {
  @Input()
  visible = false;

  artistName: string = "";
  biography: string = "";
  pictureFile: Base64String = "";

  toggleVisible(){
    this.visible = !this.visible;
  }

  onSave() {
    this.httpClient.post(this.api.generateURL("/artists"), {
      biography: this.biography,
      name: this.artistName,
      picture: this.pictureFile,
      socialLinks: []
    } as Artist, {
      observe: "response"
    }).subscribe(response => {
      console.log(response);
      this.toggleVisible();
    })
  }

  constructor(private httpClient: HttpClient, private api: APIConnectorService) { }

  ngOnInit(): void {
  }

}
