import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Artist, Release, ReleaseItem } from '../../entities';
import { ImageCoderService } from 'src/app/shared/components/img-uploader/image-coder.service';
import socialLinkIcons from "../../socialMedia";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { CreateReleaseActions, UtilReleasesActions } from '../store/releases.actions';

@Component({
  selector: 'app-add-release-modal',
  templateUrl: './add-release-modal.component.html',
  styleUrls: ['./add-release-modal.component.scss']
})
export class AddReleaseModalComponent implements OnInit {
  socialLinkIcons = socialLinkIcons;
  plusIcon = faAdd;

  releaseInput?: Release;

  @ViewChild("confirmationDialog", {read: ViewContainerRef}) confirmationDialog!: ViewContainerRef;
  
  protected releaseTitle?: string;
  protected releaseType?: string = "single";
  protected releaseDate?: Date;
  protected releaseDescription?: string;
  protected artwork?: string;
  
  protected releaseArtists: Artist[] = [];

  protected optionArtists: Artist[] = [
    {
      name: "doxbleK",
      biography: "Some content",
      mail: "konrad.koschel@hotmail.de",
      picture: new ArrayBuffer(10),
      socialLinks: [],
      id: "123"
    },
    {
      name: "doxbleD",
      biography: "Some content",
      mail: "konrad.koschel@hotmail.de",
      picture: new ArrayBuffer(10),
      socialLinks: [],
      id: "124"
    },
    {
      name: "doxbleH",
      biography: "Some content",
      mail: "konrad.koschel@hotmail.de",
      picture: new ArrayBuffer(10),
      socialLinks: [],
      id: "134"
    },
    {
      name: "doxbleI",
      biography: "Some content",
      mail: "konrad.koschel@hotmail.de",
      picture: new ArrayBuffer(10),
      socialLinks: [],
      id: "234"
    },
    {
      name: "doxbleJ",
      biography: "Some content",
      mail: "konrad.koschel@hotmail.de",
      picture: new ArrayBuffer(10),
      socialLinks: [],
      id: "12345"
    },
  ];

  protected releaseItems: Partial<ReleaseItem>[] = [{}];
  protected genres!: string[];

  optionReleaseTypes = [{id: "single", name: "Single"}, {id: "ep", name: "EP"}, {id: "album", name: "Album"}];
  
  submitBtnCaption!: string;
  title!: string;

  onSave!: () => void;
  
  constructor(
    protected sanitizer: DomSanitizer,
    protected imageCoder: ImageCoderService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.subscribe(({ artists, releases }) => {
      this.optionArtists = artists.artists;
      switch (releases.dialog.mode) {
        case "add":
          this.submitBtnCaption = "Add";
          this.title = "Add Release";
          this.onSave = this.onCreateNewRelease.bind(this);
          break;
        case "edit":
          this.initEdit();
          this.onSave = this.onUpdateRelease.bind(this);
          break;
      }
    });
  }

  initEdit() {
    // Verify mandatory input
    if (!this.releaseInput) {
      throw "In Edit Mode, a user needs to be passed!";
    }
    // Initialize UI
    this.submitBtnCaption = "Edit";
    this.title = `Edit ${this.releaseInput.name}`;
  }

  cancel() {
    this.store.dispatch(UtilReleasesActions.CANCEL_RELEASE_DIALOG());
  }

  onCreateNewRelease() {
    if (!this.releaseTitle || this.releaseTitle.trim.length === 0
      || !this.releaseDate
      || !this.releaseDescription || this.releaseDescription.trim.length === 0
      || !this.artwork || this.artwork.trim.length === 0
      || !this.releaseType || this.releaseType.trim.length === 0
      || !this.releaseArtists  || this.releaseArtists.length === 0) {
        this.store.dispatch(CreateReleaseActions.CREATE_RELEASE_ERROR({
          errorMsg: "All fields are required!"
        }));
        return;
      }

      const release: Release = {
        artwork: this.imageCoder.stringToBuffer(this.artwork)!,
        description: this.releaseDescription,
        name: this.releaseTitle,
        release_date: this.releaseDate,
        release_type: this.releaseType,
        // artists: [] // string[]
      };

      // TODO Release Items

      this.store.dispatch(CreateReleaseActions.CREATE_RELEASE({release}));
  }

  onUpdateRelease() {
    // TODO
  }

  onAddReleaseItem() {
    this.releaseItems.push({});
  }
}
