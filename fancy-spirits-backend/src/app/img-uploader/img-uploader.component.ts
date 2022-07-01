import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageCoderService } from '../image-coder.service';

@Component({
  selector: 'app-img-uploader',
  templateUrl: './img-uploader.component.html',
  styleUrls: ['./img-uploader.component.scss']
})
export class ImgUploaderComponent implements OnInit {

  requiredFileType: string = "image/png";
  
  @Input() content?: string;
  @Output() contentChange = new EventEmitter<string>();

  constructor(
    public imageCoder: ImageCoderService,
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); 

      reader.onload = (event) => { 
        const rawContent = event.target?.result as string;
        // Trim Base64 Prefix (data:base64…)
        this.content = rawContent.split(",")[1];
        this.contentChange.emit(this.content);
      }
    }
}

}
