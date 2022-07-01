import { Injectable, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
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
    })
  }
}
