import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ClickOutsideDirective } from "./click-outside.directive";
import { ConfirmationModalComponent } from "./components/confirmation-modal/confirmation-modal.component";
import { DialogService } from "./services/dialog.service";
import { ImageCoderService } from "./components/img-uploader/image-coder.service";
import { ImgUploaderComponent } from "./components/img-uploader/img-uploader.component";
import { InfoModalComponent } from "./components/info-modal/info-modal.component";
import { ListFilterPipe } from "./list-filter.pipe";
import { MultiSelectComponent } from "./components/multi-select/multi-select.component";


@NgModule({
    declarations: [
        ClickOutsideDirective,
        MultiSelectComponent,
        InfoModalComponent,
        ImgUploaderComponent,
        ConfirmationModalComponent,
        ListFilterPipe
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        MultiSelectComponent,
        ImgUploaderComponent
    ],
    providers: [ImageCoderService, DialogService]
})
export class SharedModule {}