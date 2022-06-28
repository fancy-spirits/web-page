import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ImageCoderService } from '../image-coder.service';

@Component({
  selector: 'app-img-uploader',
  templateUrl: './img-uploader.component.html',
  styleUrls: ['./img-uploader.component.scss']
})
export class ImgUploaderComponent implements OnInit {

  fileContent?: string = undefined;
  requiredFileType: string = "image/png, image/jpg";
  fileUploaded = false;

  @Output("change")
  onChange = new EventEmitter<ArrayBuffer>();

  constructor(private imageCoderService: ImageCoderService) {
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); 

      reader.onload = (event) => { 
        this.fileContent = event.target?.result as string | undefined;
        this.fileUploaded = true;
        const buffer = this.imageCoderService.toBuffer(this.fileContent!);
        this.onChange.emit(buffer);
      }
    }
}

}
