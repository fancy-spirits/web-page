import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleasePageRoutingModule } from './release-page-routing.module';
import { ReleasePageComponent } from './release-page.component';


@NgModule({
  declarations: [
    ReleasePageComponent
  ],
  imports: [
    CommonModule,
    ReleasePageRoutingModule
  ]
})
export class ReleasePageModule { }
