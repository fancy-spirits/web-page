import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Artist, SocialLink } from '../../entities';
import socialLinkIcons from "../../socialMedia";
import { ImageCoderService } from "../../shared/components/img-uploader/image-coder.service";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { CreateArtistActions, UpdateArtistActions, UtilArtistsActions } from '../store/artists.actions';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-artist-modal',
  templateUrl: './add-artist-modal.component.html',
  styleUrls: ['./add-artist-modal.component.scss']
})
export class AddArtistModalComponent implements OnInit {
  socialLinkIcons = socialLinkIcons;

  artistInput?: Artist;

  // To be replaced by Form Binding
  artistName?: string;
  biography?: string;
  picture?: string;
  mail?: string;
  socialLinks!: SocialLink[];

  submitBtnCaption!: string;
  title!: string;

  onSave!: () => void;

  constructor(
    protected sanitizer: DomSanitizer,
    protected imageCoder: ImageCoderService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.select("artists")
      .pipe(
        take(1)
      )
      .subscribe(({dialog}) => {
        switch (dialog.mode) {
          case "add": 
            this.submitBtnCaption = "Add";
            this.title = "Add Artist"; 
            this.onSave = this.onUpdateArtist.bind(this);
            break;
          case "edit":
            this.initEdit(); 
            this.onSave = this.onCreateNewArtist.bind(this);
            break;
        }
        this.artistInput = dialog.artistToBeUpdated;
        this.initSocialLinks();
      });
  }

  onCreateNewArtist() {
    if (!this.artistName || this.artistName.trim().length === 0 
      || !this.biography ||this.biography.trim().length === 0 
      || !this.picture || this.picture.trim().length === 0 
      || !this.mail || this.mail.trim().length === 0) {
        this.store.dispatch(CreateArtistActions.CREATE_ARTIST_ERROR({
          errorMsg: "All fields are required!"
        }));
        return;
    }
    const artist: Artist = {
      biography: this.biography,
      name: this.artistName,
      picture: this.imageCoder.stringToBuffer(this.picture)!,
      socialLinks: this.socialLinks.filter(link => link.link.trim().length !== 0),
      mail: this.mail
    };

    this.store.dispatch(CreateArtistActions.CREATE_ARTIST({artist}));
  }

  onUpdateArtist() {
    if (!this.artistInput 
      || !this.artistName || this.artistName.trim().length === 0 
      || !this.biography ||this.biography.trim().length === 0 
      || !this.picture || this.picture.trim().length === 0 
      || !this.mail || this.mail.trim().length === 0) {
        this.store.dispatch(CreateArtistActions.CREATE_ARTIST_ERROR({
          errorMsg: "All fields are required!"
        }));
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

    this.store.dispatch(UpdateArtistActions.UPDATE_ARTIST({updatedArtist: artist, originalName: this.artistInput.name}));
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

  findSocialLink(key: string) {
    const socialLink = this.socialLinks.find(link => link.platform === key);
    if (!socialLink) {
      throw "Invalid Key";
    }
    return socialLink;
  }

  private checkForChange<T>(oldProp: T, newProp: T): T | undefined {
    return oldProp !== newProp ? newProp : undefined;
  }

  cancel() {
    this.store.dispatch(UtilArtistsActions.CANCEL_ARTIST_DIALOG());
  }
}