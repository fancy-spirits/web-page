import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleasePageRoutingModule } from './release-page-routing.module';
import { ReleasePageComponent } from './release-page/release-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AddReleaseModalComponent } from './add-release-modal/add-release-modal.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ReleasePageComponent,
    AddReleaseModalComponent
  ],
  imports: [
    CommonModule,
    ReleasePageRoutingModule,
    FontAwesomeModule,
    FormsModule,
    SharedModule
  ]
})
export class ReleasePageModule { }
