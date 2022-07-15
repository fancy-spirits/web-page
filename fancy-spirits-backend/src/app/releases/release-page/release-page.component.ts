import { HttpClient } from '@angular/common/http';
import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { AddReleaseModalComponent } from '../add-release-modal/add-release-modal.component';
import { APIConnectorService } from '../../shared/services/apiconnector.service';
import { DialogService } from '../../shared/services/dialog.service';
import { Release } from '../../entities';
import { ImageCoderService } from 'src/app/shared/components/img-uploader/image-coder.service';

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
  visibleModal?: ComponentRef<AddReleaseModalComponent> = undefined;

  constructor(
    private httpClient: HttpClient, 
    private api: APIConnectorService, 
    private imageCoderService: ImageCoderService,
    protected sanitizer: DomSanitizer,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadReleases();
  }

  onNewRelease = () => {
    (this.visibleModal as ComponentRef<AddReleaseModalComponent>)?.instance.cancel();
    const modal = this.modalAdd.createComponent(AddReleaseModalComponent);
    modal.instance.releaseOutput.subscribe(this.onReleaseCreated);
    modal.instance.mode = "add";
    this.visibleModal = modal;
  }

  onEditRelease(id: string) {

  }

  onDeleteRelease(release: Release) {

  }

  loadReleases() {
    this.httpClient.get(this.api.generateURL("/releases"), {observe: "body"})
      .subscribe({
        next: body => this.releases = body as Release[],
        error: () => console.log("Releases could not be loaded.")
      });
  }

  onReleaseCreated = ([success, mode]: [success: boolean | "cancel", mode: "add" | "edit"]) => {
    if (!this.modalAdd) throw "Weird stuff going on";
    
    switch (success) {
      // @ts-expect-error
      case true:
        this.loadReleases();
      case 'cancel':
        this.modalAdd.remove(0);
        this.visibleModal = undefined;
        break;
      case false:
        const message = `${mode === "add" ? "Creation failed!" : "Editing release failed!"}`
        this.dialogService.showInfoDialog(this.sanitizer, this.confirmationDialog, "Error", message);
    }
  }
}
