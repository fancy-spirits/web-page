import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { AddReleaseModalComponent } from '../add-release-modal/add-release-modal.component';
import { DialogService } from '../../shared/services/dialog.service';
import { Release } from '../../entities';
import { ImageCoderService } from 'src/app/shared/components/img-uploader/image-coder.service';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { FetchArtistsActions } from 'src/app/artists/store/artists.actions';
import { DeleteReleaseActions, UtilReleasesActions } from '../store/releases.actions';

@Component({
  selector: 'app-release-page',
  templateUrl: './release-page.component.html',
  styleUrls: ['./release-page.component.scss']
})
export class ReleasePageComponent implements OnInit {
  toBase64 = this.imageCoderService.bufferToSanitizedString;
  iconEdit = faPenToSquare;
  iconDelete = faTrashCan;

  releases: Release[] = [];

  @ViewChild("confirmationDialog", {read: ViewContainerRef}) confirmationDialog!: ViewContainerRef;

  @ViewChild("modalAddRelease", {read: ViewContainerRef}) modalAdd!: ViewContainerRef;
  AddReleaseModalComponent = AddReleaseModalComponent;

  constructor(
    private imageCoderService: ImageCoderService,
    protected sanitizer: DomSanitizer,
    private dialogService: DialogService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(FetchArtistsActions.FETCH_ARTISTS());

    this.store.select("releases")
      .subscribe(({releases, dialog}) => {
        this.releases = releases;

        if (dialog.visible) {
          this.showReleaseDialog();
        } else {
          this.closeReleaseDialog();
        }

        if (!!dialog.error) {
          this.dialogService.showInfoDialog(this.sanitizer, this.confirmationDialog, "Error", dialog.error);
        }

        if(!!dialog.info) {
          this.dialogService.showInfoDialog(this.sanitizer, this.confirmationDialog, "Info", dialog.info)
            .then(() => this.store.dispatch(UtilReleasesActions.CLEAR_INFO()));
        }
      });
  }

  onNewRelease = () => {
    this.store.dispatch(UtilReleasesActions.OPEN_RELEASE_DIALOG({
      mode: "add"
    }));
  }

  onEditRelease(id: string) {
    this.store.dispatch(UtilReleasesActions.OPEN_RELEASE_DIALOG({
      mode: "edit",
      releaseToBeUpdated: this.releases.find(release => release.id === id)!
    }));
  }

  async onDeleteRelease(release: Release) {
    const message = `Do you really want to remove ${release.name}?`;
    const deleteArtist = await this.dialogService.showConfirmationDialog(this.sanitizer, this.confirmationDialog, "Attention", message);
    
    if (!deleteArtist) {
      return;
    }

    this.store.dispatch(DeleteReleaseActions.DELETE_RELEASE({release}));
  }

  showReleaseDialog() {
    this.modalAdd.clear();
    this.modalAdd.createComponent(AddReleaseModalComponent);
  }

  closeReleaseDialog() {
    this.modalAdd.clear();
  }
}
