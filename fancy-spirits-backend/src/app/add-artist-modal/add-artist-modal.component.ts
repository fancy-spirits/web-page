import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-artist-modal',
  templateUrl: './add-artist-modal.component.html',
  styleUrls: ['./add-artist-modal.component.scss']
})
export class AddArtistModalComponent implements OnInit {
  @Input()
  visible = false;

  toggleVisible(){
    this.visible = !this.visible;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
