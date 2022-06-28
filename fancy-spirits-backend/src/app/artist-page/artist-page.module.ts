import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistPageRoutingModule } from './artist-page-routing.module';
import { ArtistPageComponent } from './artist-page.component';
import { AddArtistModalComponent } from '../add-artist-modal/add-artist-modal.component';
import { ImgUploaderComponent } from '../img-uploader/img-uploader.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    ArtistPageComponent,
    AddArtistModalComponent,
    ImgUploaderComponent
  ],
  imports: [
    CommonModule,
    ArtistPageRoutingModule,
    FontAwesomeModule
  ]
})
export class ArtistPageModule { }
