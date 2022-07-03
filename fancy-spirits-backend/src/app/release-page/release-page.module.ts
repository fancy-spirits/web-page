import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleasePageRoutingModule } from './release-page-routing.module';
import { ReleasePageComponent } from './release-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AddReleaseModalComponent } from '../add-release-modal/add-release-modal.component';
import { ImgUploaderModule } from '../img-uploader/img-uploader.module';
import { MultiSelectComponentModule } from '../multi-select/multi-select.module';


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
    ImgUploaderModule,
    MultiSelectComponentModule
  ]
})
export class ReleasePageModule { }
