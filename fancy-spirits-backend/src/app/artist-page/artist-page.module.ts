import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistPageRoutingModule } from './artist-page-routing.module';
import { ArtistPageComponent } from './artist-page.component';


@NgModule({
  declarations: [
    ArtistPageComponent
  ],
  imports: [
    CommonModule,
    ArtistPageRoutingModule
  ]
})
export class ArtistPageModule { }
