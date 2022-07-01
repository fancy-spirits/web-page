import { HttpClient } from '@angular/common/http';
import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { APIConnectorService } from '../apiconnector.service';
import { Artist } from '../entities';
import { ImageCoderService } from '../image-coder.service';
import socialMediaIcons from "../socialMedia";
import { DomSanitizer } from '@angular/platform-browser';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { AddArtistModalComponent } from '../add-artist-modal/add-artist-modal.component';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.scss']
})
export class ArtistPageComponent implements OnInit {
  toBase64 = this.imageCoderService.bufferToSanitizedString;
  getSocialMediaIcon = socialMediaIcons.get;
  iconEdit = faPenToSquare;
  iconDelete = faTrashCan;

  artists: Artist[] = [];

  @ViewChild("confirmationDialog", {read: ViewContainerRef}) confirmationDialog!: ViewContainerRef;

  @ViewChild("modalAdd", {read: ViewContainerRef}) modalAdd!: ViewContainerRef;
  AddArtistModalComponent = AddArtistModalComponent;
  visibleModal?: ComponentRef<any> = undefined;

  addArtistModalVisible = false;

  constructor(
    private httpClient: HttpClient, 
    private api: APIConnectorService, 
    private imageCoderService: ImageCoderService,
    public sanitizer: DomSanitizer,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  onNewArtist(){
    (this.visibleModal as ComponentRef<AddArtistModalComponent>)?.instance.cancel();
    const modal = this.modalAdd.createComponent(AddArtistModalComponent);
    modal.instance.artistOutput.subscribe(this.onArtistCreated);
    modal.instance.mode = "add";
    this.visibleModal = modal;
  }

  loadArtists = () => {
    this.httpClient.get(this.api.generateURL("/artists"), {observe: "body"}, )
      .subscribe({
        next: body => {
          this.artists = body as Artist[];
        },
        error: _error => console.log("Artists could not be loaded")
      });
  }

  onArtistCreated = (success: boolean | "cancel", mode: "add" | "edit") => {
    switch (success) {
      // @ts-expect-error
      case true:
        this.loadArtists();
      case 'cancel':
        this.modalAdd.remove(0);
        this.visibleModal = undefined;
        break;
      case false:
        const message = `${mode === "add" ? "Creation failed!" : "Editing artist failed!"}`
        this.dialogService.showInfoDialog(this.sanitizer, this.confirmationDialog, "Error", message);
    }
  }

  getSocialLinks(artist: Artist) {
    return artist.socialLinks.filter(link => link.platform_type === "social");
  }
  
  getStreamingLinks(artist: Artist) {
    return artist.socialLinks.filter(link => link.platform_type === "streaming");
  }

  onEditArtist(id: string) {
    (this.visibleModal as ComponentRef<AddArtistModalComponent>)?.instance.cancel();
    const modal = this.modalAdd.createComponent(AddArtistModalComponent);
    modal.instance.artistOutput.subscribe(this.onArtistCreated);
    modal.instance.mode = "edit";
    modal.instance.artistInput = this.artists.find(artist => artist.id === id)!;
    this.visibleModal = modal;
  }

  async onDeleteArtist(artist: Artist) {
    const message = `Do you really want to fire ${artist.name}?<br>All solo releases will be deleted, too!`;
    const deleteArtist = await this.dialogService.showConfirmationDialog(this.sanitizer, this.confirmationDialog, "Attention", message);
    
    if (!deleteArtist) {
      return;
    }

    this.httpClient.delete(this.api.generateURL(`/artists/${artist.name}`), {observe: "response"})
      .subscribe({
        next: () => {
          this.loadArtists();
          this.dialogService.showInfoDialog(this.sanitizer, this.confirmationDialog, "Info", `${artist.name} was fired sucessfully`);
        },
        error: () =>this.dialogService.showInfoDialog(this.sanitizer, this.confirmationDialog, "Info", `${artist.name} could not be fired…`)
      });
  }
}
