import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  title!: string;
  message!: SafeHtml;

  @Output() dialogSubmitted = new EventEmitter<ConfirmationResult>();

  constructor() { }

  ngOnInit(): void {
  }

  protected onNo() {
    this.dialogSubmitted.emit("no");
  }

  protected onYes() {
    this.dialogSubmitted.emit("yes");
  }

}

type ConfirmationResult = "yes" | "no";
