import { HttpClient } from '@angular/common/http';
import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { APIConnectorService } from '../apiconnector.service';
import { Artist } from '../entities';
import { ImageCoderService } from '../image-coder.service';
import socialMediaIcons from "../socialMedia";
import { DomSanitizer } from '@angular/platform-browser';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { AddArtistModalComponent } from '../add-artist-modal/add-artist-modal.component';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.scss']
})
export class ArtistPageComponent implements OnInit {
  toBase64 = this.imageCoderService.toBase64;
  getSocialMediaIcon = socialMediaIcons.get;
  iconEdit = faPenToSquare;
  iconDelete = faTrashCan;

  artists: Artist[] = [];

  @ViewChild("modalAdd", {read: ViewContainerRef}) modalAdd!: ViewContainerRef;
  AddArtistModalComponent = AddArtistModalComponent;
  visibleModal?: ComponentRef<any> = undefined;

  addArtistModalVisible = false;

  constructor(
    private httpClient: HttpClient, 
    private api: APIConnectorService, 
    private imageCoderService: ImageCoderService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  onNewArtist(){
    // this.addArtistModalVisible = true;
    const modal = this.modalAdd.createComponent(AddArtistModalComponent);
    modal.instance.artistCreated.subscribe(this.onArtistCreated);
    this.visibleModal = modal;
  }

  loadArtists = () => {
    this.httpClient.get(this.api.generateURL("/artists"), {observe: "body"}, )
      .subscribe({
        next: body => {
          this.artists = body as Artist[];
          console.log(this.artists);
        },
        error: _error => console.log("Artists could not be loaded")
      });
  }

  onArtistCreated = (success: boolean | "cancel") => {
    switch (success) {
      // @ts-expect-error
      case true:
        this.loadArtists();
      case 'cancel':
        this.modalAdd.remove(0);
        this.visibleModal = undefined;
        break;
      case false:
        alert("Creation failed");
    }
  }

  getSocialLinks(artist: Artist) {
    return artist.socialLinks.filter(link => link.platform_type === "social");
  }
  
  getStreamingLinks(artist: Artist) {
    return artist.socialLinks.filter(link => link.platform_type === "streaming");
  }

  onEditArtist(id: string) {

  }

  onDeleteArtist(id: string) {

  }
}
