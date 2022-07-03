import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiSelectComponent } from './multi-select.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ListFilterPipe } from '../list-filter.pipe';
import { ClickOutsideDirective } from '../click-outside.directive';


@NgModule({
  declarations: [
    MultiSelectComponent,
    ListFilterPipe,
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [
    MultiSelectComponent
  ]
})
export class MultiSelectComponentModule { }
