import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ImgUploaderComponent } from './img-uploader.component';


@NgModule({
  declarations: [
    ImgUploaderComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [
    ImgUploaderComponent
  ]
})
export class ImgUploaderModule { }
