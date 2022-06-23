import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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
  onChange = new  EventEmitter<ArrayBuffer>();

  constructor() {
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
        const decodedString = window.atob(this.fileContent?.split(",")[1] as string);
        const buffer = new Uint8Array(decodedString.length);
        for (let i = 0; i < decodedString.length; i++) {
          buffer[i] = decodedString.charCodeAt(i);
        }
        this.onChange?.emit(buffer);
      }
    }
}

}
