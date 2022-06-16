import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationPaneComponent } from './navigation-pane/navigation-pane.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddArtistModalComponent } from './add-artist-modal/add-artist-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationPaneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }