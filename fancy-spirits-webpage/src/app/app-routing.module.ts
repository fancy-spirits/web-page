import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    redirectTo: "artists",
    pathMatch: "full"
  },
  { path: 'artists', loadChildren: () => import('./artist-page/artist-page.module').then(m => m.ArtistPageModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
