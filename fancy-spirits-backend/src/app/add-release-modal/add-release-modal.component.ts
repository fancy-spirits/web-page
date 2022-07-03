import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { APIConnectorService } from '../apiconnector.service';
import { DialogService } from '../dialog.service';
import { Artist, Release } from '../entities';
import { ImageCoderService } from '../image-coder.service';
import socialLinkIcons from "../socialMedia";

@Component({
  selector: 'app-add-release-modal',
  templateUrl: './add-release-modal.component.html',
  styleUrls: ['./add-release-modal.component.scss']
})
export class AddReleaseModalComponent implements OnInit {
  socialLinkIcons = socialLinkIcons;

  @Input()
  mode!: "add" | "edit";

  @Input("release")
  releaseInput?: Release;
  
  @Output()
  releaseOutput = new EventEmitter<[boolean | "cancel", "add" | "edit"]>();

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

  optionReleaseTypes = [{id: "single", name: "Single"}, {id: "ep", name: "EP"}, {id: "album", name: "Album"}];
  
  submitBtnCaption!: string;
  title!: string;
  
  constructor(
    private httpClient: HttpClient, 
    private api: APIConnectorService, 
    protected sanitizer: DomSanitizer,
    protected imageCoder: ImageCoderService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadArtists();
    switch (this.mode) {
      case "add": 
        this.initCreate(); break;
      case "edit":
        throw "Not yet implemented!";
        // this.initEdit(); break;
      default: 
        throw "Mode must be set!";
    }
  }

  initCreate() {
    this.submitBtnCaption = "Add";
    this.title = "Add Release";
  }

  loadArtists = () => {
    this.httpClient.get(this.api.generateURL("/artists"), {observe: "body"})
      .subscribe({
        next: body => this.optionArtists = body as Artist[],
        error: () => this.dialogService.showInfoDialog(this.sanitizer, this.confirmationDialog, "Error", "Artists could not be loaded!")
      });
  }

  cancel() {
    this.releaseOutput.emit(["cancel", this.mode]);
  }

  onSave() {
    if (this.mode === "add") {
      this.onCreateNewRelease();
    } else {
      throw "Not yet implemented!";
      // this.onUpdateArtist();
    }
  }

  onCreateNewRelease() {
    if (!this.releaseTitle || this.releaseTitle.trim.length === 0
      || !this.releaseDate
      || !this.releaseDescription || this.releaseDescription.trim.length === 0
      || !this.artwork || this.artwork.trim.length === 0
      || !this.releaseType || this.releaseType.trim.length === 0
      || !this.releaseArtists  || this.releaseArtists.length === 0) {
        this.releaseOutput.emit([false, this.mode]);
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

      this.httpClient.post(this.api.generateURL("/releases"), release, {observe: "response"})
        .subscribe({
          next: response => this.releaseOutput.emit([response.status < 400, this.mode]),
          error: () => this.releaseOutput.emit([false, this.mode])
        });
  }
}
