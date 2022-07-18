import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Artist } from '../../entities';
import { ImageCoderService } from '../../shared/components/img-uploader/image-coder.service';
import socialMediaIcons from "../../socialMedia";
import { DomSanitizer } from '@angular/platform-browser';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { AddArtistModalComponent } from '../add-artist-modal/add-artist-modal.component';
import { DialogService } from '../../shared/services/dialog.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { DeleteArtistActions, FetchArtistsActions, UtilArtistsActions } from '../store/artists.actions';

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

  constructor(
    private imageCoderService: ImageCoderService,
    public sanitizer: DomSanitizer,
    private dialogService: DialogService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(FetchArtistsActions.FETCH_ARTISTS());
    this.store.select("artists")
      .subscribe(({artists, dialog}) => {
        this.artists = artists;

        if (dialog.visible) {
          this.showArtistDialog();
        } else {
          this.closeArtistDialog();
        }

        if (!!dialog.error) {
          this.dialogService.showInfoDialog(this.sanitizer, this.confirmationDialog, "Error", dialog.error);
        }

        if(!!dialog.info) {
          this.dialogService.showInfoDialog(this.sanitizer, this.confirmationDialog, "Info", dialog.info)
            .then(() => this.store.dispatch(UtilArtistsActions.CLEAR_INFO()));
        }
      })
  }

  onNewArtist(){
    this.store.dispatch(UtilArtistsActions.OPEN_ARTIST_DIALOG({
      mode: "add"
    }));
  }

  onEditArtist(id: string) {
    this.store.dispatch(UtilArtistsActions.OPEN_ARTIST_DIALOG({
      mode: "edit",
      artistToBeUpdated: this.artists.find(artist => artist.id === id)!
    }));
  }

  getSocialLinks(artist: Artist) {
    return artist.socialLinks.filter(link => link.platform_type === "social");
  }
  
  getStreamingLinks(artist: Artist) {
    return artist.socialLinks.filter(link => link.platform_type === "streaming");
  }

  showArtistDialog() {
    this.modalAdd.clear();
    this.modalAdd.createComponent(AddArtistModalComponent);
  }

  closeArtistDialog() {
    this.modalAdd.clear();
  }

  async onDeleteArtist(artist: Artist) {
    const message = `Do you really want to fire ${artist.name}?<br>All solo releases will be deleted, too!`;
    const deleteArtist = await this.dialogService.showConfirmationDialog(this.sanitizer, this.confirmationDialog, "Attention", message);
    
    if (!deleteArtist) {
      return;
    }

    this.store.dispatch(DeleteArtistActions.DELETE_ARTIST({artistName: artist.name}));
  }
}
