import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleasePageRoutingModule } from './release-page-routing.module';
import { ReleasePageComponent } from './release-page.component';
import { ReleaseBoxComponent } from '../release-box/release-box.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    ReleasePageComponent,
    ReleaseBoxComponent
  ],
  imports: [
    CommonModule,
    ReleasePageRoutingModule,
    FontAwesomeModule
  ]
})
export class ReleasePageModule { }
