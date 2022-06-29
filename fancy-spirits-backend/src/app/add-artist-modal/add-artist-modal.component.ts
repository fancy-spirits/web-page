import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { APIConnectorService } from '../apiconnector.service';
import { Artist, SocialLink } from '../entities';
import socialLinkIcons from "../socialMedia";
import { ImageCoderService } from "../image-coder.service";

@Component({
  selector: 'app-add-artist-modal',
  templateUrl: './add-artist-modal.component.html',
  styleUrls: ['./add-artist-modal.component.scss']
})
export class AddArtistModalComponent implements OnInit {
  socialLinkIcons = socialLinkIcons;

  @Input()
  mode!: "add" | "edit";

  @Input("artist")
  artistEdit!: Artist;

  @Output()
  artistCreated = new EventEmitter<boolean | "cancel">();

  artistName: string = "";
  biography: string = "";
  pictureFile?: ArrayBuffer;
  mail: string = "";

  socialLinks: SocialLink[] = [];

  submitBtnCaption!: string;
  title!: string;
  prefills!: Prefills;

  onSave = () => {
    if (this.mode === "add") {
      this.onCreateNewArtist();
    } else {
      this.onUpdateArtist();
    }
  }

  onCreateNewArtist() {
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
        },
        error: _error => this.artistCreated.emit(false)
      });
  }

  onUpdateArtist() {
    const artist: Partial<Artist> = {
      id: this.artistEdit.id,
      biography: this.checkForChange(this.artistEdit.biography, this.biography),
      mail: this.checkForChange(this.artistEdit.mail, this.mail),
      name: this.checkForChange(this.artistEdit.name, this.artistName),
      picture: this.checkForChange(this.artistEdit.picture, this.pictureFile),
      // This will not work
      socialLinks: this.checkForChange(this.artistEdit.socialLinks, this.socialLinks)
    };
    this.httpClient.patch(this.api.generateURL(`/artists/${this.artistEdit.name}`), artist, {observe: "response"})
      .subscribe({
        next: response => {
          this.artistCreated.emit(response.status < 400);
        },
        error: _error => this.artistCreated.emit(false)
      });
  }

  private checkForChange<T>(oldProp: T, newProp: T): T | undefined {
    return oldProp !== newProp ? newProp : undefined;
  }

  cancel() {
    this.artistCreated.emit("cancel");
  }

  constructor(
    private httpClient: HttpClient, 
    private api: APIConnectorService, 
    public sanitizer: DomSanitizer,
    public imageCoder: ImageCoderService
  ) { 
    this.submitBtnCaption = this.mode === "edit" ? "Edit" : "Add";
    this.title = this.mode === "edit" ? `Edit ${this.artistEdit.name}` : "Add Artist";
    if (this.mode === "edit") {
      const socialLinkPrefills = this.artistEdit.socialLinks.map(link => {
        const obj: {[key: string]: string} = {};
        obj[link.platform] = link.link;
        return obj;
      })
      this.prefills = {
        biography: this.artistEdit.biography,
        name: this.artistEdit.name,
        mail: this.artistEdit.mail,
        picture: imageCoder.toBase64(this.sanitizer, this.artistEdit.picture),
        links: socialLinkPrefills.reduce((prev, curr) => ({...prev, ...curr}), {})
      }
    }
  }

  ngOnInit(): void {
  }

  onNameChanged(event: any) {
    this.artistName = event.target.value;
  }

  onBiographyChanged(event: any) {
    this.biography = event.target.value;
  }

  onPictureChanged = (picture: ArrayBuffer) => {
    this.pictureFile = picture;
    this.prefills.picture = this.imageCoder.toBase64(this.sanitizer, picture);
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

type Prefills = {
  name: string;
  biography: string;
  mail: string;
  picture: SafeResourceUrl;
  links: {
    [key: string]: string
  }
}