import { Injectable, ViewContainerRef } from '@angular/core';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor() { }

  showConfirmationDialog(rootComponent: ViewContainerRef, title: string, message: string): Promise<boolean> {
    return new Promise((res) => {
      const dialog = rootComponent.createComponent(ConfirmationModalComponent);
      dialog.instance.title = title;
      dialog.instance.message = message;
      dialog.instance.dialogSubmitted.subscribe(submitStatus => {
        dialog.destroy();
        res(submitStatus === "yes");
      })
    })
  }
}
