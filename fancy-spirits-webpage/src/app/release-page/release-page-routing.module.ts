import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReleasePageComponent } from './release-page.component';

const routes: Routes = [{ path: '', component: ReleasePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReleasePageRoutingModule { }
