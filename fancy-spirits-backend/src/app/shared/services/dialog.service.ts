import { Injectable, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { InfoModalComponent } from '../components/info-modal/info-modal.component';

@Injectable()
export class DialogService {

  constructor() { }

  showConfirmationDialog(sanitizer: DomSanitizer, rootComponent: ViewContainerRef, title: string, message: string): Promise<boolean> {
    return new Promise((res) => {
      const dialog = rootComponent.createComponent(ConfirmationModalComponent);
      dialog.instance.title = title;
      dialog.instance.message = sanitizer.bypassSecurityTrustHtml(message);
      dialog.instance.dialogSubmitted.subscribe(submitStatus => {
        dialog.destroy();
        res(submitStatus === "yes");
      })
    });
  }

  showInfoDialog(sanitizer: DomSanitizer, rootComponent: ViewContainerRef, title: string, message: string) {
    return new Promise((res: (value: void) => void) => {
      const dialog = rootComponent.createComponent(InfoModalComponent);
      dialog.instance.title = title;
      dialog.instance.message = sanitizer.bypassSecurityTrustHtml(message);
      dialog.instance.dialogSubmitted.subscribe(() => {
        dialog.destroy();
        res();
      })
    });
  }
}
