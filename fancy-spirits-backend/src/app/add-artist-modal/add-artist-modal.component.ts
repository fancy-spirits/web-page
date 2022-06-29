import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIConnectorService } from '../apiconnector.service';
import { Artist, SocialLink } from '../entities';
import socialLinkIcons from "../socialMedia";

@Component({
  selector: 'app-add-artist-modal',
  templateUrl: './add-artist-modal.component.html',
  styleUrls: ['./add-artist-modal.component.scss']
})
export class AddArtistModalComponent implements OnInit {
  socialLinkIcons = socialLinkIcons;

  // @Input()
  // visible = false;

  @Output()
  artistCreated = new EventEmitter<boolean | "cancel">();

  artistName: string = "";
  biography: string = "";
  pictureFile?: ArrayBuffer;
  mail: string = "";

  socialLinks: SocialLink[] = [];

  onSave = () => {
    const artist: Artist = {
      biography: this.biography,
      name: this.artistName,
      picture: this.pictureFile!,
      socialLinks: this.socialLinks.filter(link => link.link.trim().length !== 0),
      mail: this.mail
    };

    this.httpClient.post(this.api.generateURL("/artists"), artist, { observe: "response"})
      .subscribe({
        next: response => {
          this.artistCreated.emit(response.status < 400);
          // this.visible = false;
        },
        error: _error => this.artistCreated.emit(false)
      });
  }

  cancel() {
    this.artistCreated.emit("cancel");
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

  onMailChanged(event: any) {
    this.mail = event.target.value;
  }

  onStreamingLinkChanged(event: any, key: string) {
    const existingLink = this.socialLinks.find(link => link.platform_type === "streaming" && link.platform === key);
    if (!!existingLink) {
      existingLink.link = event.target.value;
      return;
    }
    this.socialLinks.push({
      link: event.target.value,
      platform: key,
      platform_type: "streaming"
    });
  }
  
  onSocialLinkChanged(event: any, key: string) {
    const existingLink = this.socialLinks.find(link => link.platform_type === "social" && link.platform === key);
    if (!!existingLink) {
      existingLink.link = event.target.value;
      return;
    }
    this.socialLinks.push({
      link: event.target.value,
      platform: key,
      platform_type: "social"
    });
  }
}
