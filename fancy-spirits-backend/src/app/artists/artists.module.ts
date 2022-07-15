import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ArtistsRoutingModule } from "./artists-routing.module";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { AddArtistModalComponent } from "./add-artist-modal/add-artist-modal.component";
import { ArtistPageComponent } from "./artist-page/artist-page.component";

@NgModule({
    declarations: [
        AddArtistModalComponent,
        ArtistPageComponent
    ],
    imports: [
        CommonModule,
        ArtistsRoutingModule,
        FontAwesomeModule,
        FormsModule,
        SharedModule
    ],
    exports: [
        ArtistPageComponent
    ]
})
export class ArtistsModule {}