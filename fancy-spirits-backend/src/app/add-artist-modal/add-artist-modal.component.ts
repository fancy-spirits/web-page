import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
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

  @Input()
  artistCreated = new EventEmitter();

  artistName: string = "";
  biography: string = "";
  pictureFile?: ArrayBuffer;

  toggleVisible(){
    this.visible = !this.visible;
  }

  onSave = () => {
    this.httpClient.post(this.api.generateURL("/artists"), {
      biography: this.biography,
      name: this.artistName,
      picture: this.pictureFile,
      socialLinks: []
    } as Artist, {
      observe: "response"
    }).subscribe(response => {
      this.toggleVisible();
      this.artistCreated.emit();
    })
  }

  constructor(private httpClient: HttpClient, private api: APIConnectorService) { }

  ngOnInit(): void {
  }

  onNameChanged(event: any) {
    this.artistName = event.target.value;
  }

  onBiographyChanged(event: any) {
    this.biography = event.target.value;
  }

  onPictureChanged(picture: ArrayBuffer) {
    this.pictureFile = picture;
  }

}
