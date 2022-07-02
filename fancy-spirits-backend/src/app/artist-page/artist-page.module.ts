import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistPageRoutingModule } from './artist-page-routing.module';
import { ArtistPageComponent } from './artist-page.component';
import { AddArtistModalComponent } from '../add-artist-modal/add-artist-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ImgUploaderModule } from '../img-uploader/img-uploader.module';


@NgModule({
  declarations: [
    ArtistPageComponent,
    AddArtistModalComponent
  ],
  imports: [
    CommonModule,
    ArtistPageRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ImgUploaderModule
  ]
})
export class ArtistPageModule { }
