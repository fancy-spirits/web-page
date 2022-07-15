import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationPaneComponent } from './navigation-pane/navigation-pane.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { ArtistsModule } from './artists/artists.module';
import { ReleasePageModule } from './releases/release-page.module';

@NgModule({
  declarations: [
    AppComponent,
    NavigationPaneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ArtistsModule,
    ReleasePageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
