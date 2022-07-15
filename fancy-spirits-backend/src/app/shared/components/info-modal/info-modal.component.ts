import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {

  title!: string;
  message!: SafeHtml;

  @Output() dialogSubmitted = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  protected onOk() {
    this.dialogSubmitted.emit();
  }

}
