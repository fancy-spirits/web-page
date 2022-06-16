import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'artists', 
    loadChildren: () => import('./artist-page/artist-page.module').then(m => m.ArtistPageModule) 
  }, 
  { 
    path: 'releases', 
    loadChildren: () => import('./release-page/release-page.module').then(m => m.ReleasePageModule) 
  },
  {
    path: '',
    redirectTo: "artists",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
