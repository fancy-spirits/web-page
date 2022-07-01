import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  artistInput?: Artist;

  @Output()
  artistOutput = new EventEmitter<boolean | "cancel">();

  artistName?: string;
  biography?: string;
  picture?: string;
  mail?: string;
  // artistName: string = "";
  // biography: string = "";
  // pictureFile?: ArrayBuffer;
  // mail: string = "";

  socialLinks!: SocialLink[];

  submitBtnCaption!: string;
  title!: string;
  // prefills!: Prefills;

  onSave = () => {
    if (this.mode === "add") {
      this.onCreateNewArtist();
    } else {
      this.onUpdateArtist();
    }
  }

  findSocialLink(key: string) {
    const socialLink = this.socialLinks.find(link => link.platform === key);
    if (!socialLink) {
      throw "Invalid Key";
    }
    return socialLink;
  }

  onCreateNewArtist() {
    if (!this.artistName || this.artistName.trim().length === 0 
      || !this.biography ||this.biography.trim().length === 0 
      || !this.picture || this.picture.trim().length === 0 
      || !this.mail || this.mail.trim().length === 0) {
        this.artistOutput.emit(false);
        return;
    }
    const artist: Artist = {
      biography: this.biography,
      name: this.artistName,
      picture: this.imageCoder.stringToBuffer(this.picture)!,
      socialLinks: this.socialLinks.filter(link => link.link.trim().length !== 0),
      mail: this.mail
    };

    this.httpClient.post(this.api.generateURL("/artists"), artist, { observe: "response"})
      .subscribe({
        next: response => {
          this.artistOutput.emit(response.status < 400);
        },
        error: _error => this.artistOutput.emit(false)
      });
  }

  onUpdateArtist() {
    if (!this.artistInput 
      || !this.artistName || this.artistName.trim().length === 0 
      || !this.biography ||this.biography.trim().length === 0 
      || !this.picture || this.picture.trim().length === 0 
      || !this.mail || this.mail.trim().length === 0) {
        this.artistOutput.emit(false);
        return;
    }
    const oldImage = this.imageCoder.bufferToString(this.artistInput.picture);
    const artist: Partial<Artist> = {
      id: this.artistInput.id,
      biography: this.checkForChange(this.artistInput.biography, this.biography),
      mail: this.checkForChange(this.artistInput.mail, this.mail),
      name: this.checkForChange(this.artistInput.name, this.artistName),
      picture: this.imageCoder.stringToBuffer(this.checkForChange(oldImage, this.picture)),
      socialLinks: this.socialLinks
    };
    this.httpClient.patch(this.api.generateURL(`/artists/${this.artistInput!.name}`), artist, {observe: "response"})
      .subscribe({
        next: response => {
          this.artistOutput.emit(response.status < 400);
        },
        error: _error => this.artistOutput.emit(false)
      });
  }

  private checkForChange<T>(oldProp: T, newProp: T): T | undefined {
    return oldProp !== newProp ? newProp : undefined;
  }

  cancel() {
    this.artistOutput.emit("cancel");
  }

  constructor(
    private httpClient: HttpClient, 
    private api: APIConnectorService, 
    public sanitizer: DomSanitizer,
    public imageCoder: ImageCoderService
  ) { }

  initCreate() {
    this.submitBtnCaption = "Add";
    this.title = "Add Artist";
  }

  initEdit() {
    // Verify mandatory input
    if (!this.artistInput) {
      throw "In Edit Mode, a user needs to be passed!";
    }
    // Initialize UI
    this.submitBtnCaption = "Edit";
    this.title = `Edit ${this.artistInput.name}`;

    // Initialize inputs
    this.artistName = this.artistInput.name;
    this.biography = this.artistInput.biography;
    this.mail = this.artistInput.mail;
    this.socialLinks = this.artistInput.socialLinks;
    this.picture = this.imageCoder.bufferToString(this.artistInput.picture);
  }

  ngOnInit(): void {
    switch (this.mode) {
      case "add": 
        this.initCreate(); break;
      case "edit":
        this.initEdit(); break;
      default: 
        throw "Mode must be set!";
    }
    this.initSocialLinks();
  }

  initSocialLinks() {
    this.socialLinks = [];
    
    // Initialize to prevent NPE
    socialLinkIcons.streaming.forEach(link => this.socialLinks.push({
      link: "",
      platform: link.key,
      platform_type: "streaming"
    }));
    
    socialLinkIcons.social.forEach(link => this.socialLinks.push({
      link: "",
      platform: link.key,
      platform_type: "social"
    }));

    // If Edit
    if (!this.artistInput) {
      return;
    }
    this.artistInput.socialLinks.forEach(socialLink => {
      const link = this.socialLinks.find(link => socialLink.platform === link.platform);
      if (!link) {
        throw "Invalid Key";
      }
      link.link = socialLink.link;
    })
  }
}