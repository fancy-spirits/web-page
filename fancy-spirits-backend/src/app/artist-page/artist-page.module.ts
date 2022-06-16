import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistPageRoutingModule } from './artist-page-routing.module';
import { ArtistPageComponent } from './artist-page.component';
import { AddArtistModalComponent } from '../add-artist-modal/add-artist-modal.component';


@NgModule({
  declarations: [
    ArtistPageComponent,
    AddArtistModalComponent
  ],
  imports: [
    CommonModule,
    ArtistPageRoutingModule
  ]
})
export class ArtistPageModule { }
