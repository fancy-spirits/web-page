import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistPageRoutingModule } from './artist-page-routing.module';
import { ArtistPageComponent } from './artist-page.component';
import { ArtistBoxComponent } from '../artist-box/artist-box.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    ArtistPageComponent,
    ArtistBoxComponent
  ],
  imports: [
    CommonModule,
    ArtistPageRoutingModule,
    FontAwesomeModule
  ]
})
export class ArtistPageModule { }
