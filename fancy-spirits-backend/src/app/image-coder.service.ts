import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageCoderService {

  constructor() { }

  toBuffer(base64: string) {
    const decodedString = window.atob(base64.split(",")[1]);
    const buffer = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i++) {
        buffer[i] = decodedString.charCodeAt(i);
    }
    return buffer;  
  }

  toBase64(sanitizer: DomSanitizer, buffer: any) {
      const imageB64_coded = Object.keys(buffer?.data ?? {}).reduce(
        (prev, curr) => prev + String.fromCharCode(buffer.data[curr]), 
      "");
      const imageB64 =  window.btoa(imageB64_coded);
      return sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;charset=utf-8;base64,${imageB64}`);
  }
}
