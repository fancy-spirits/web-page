import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable()
export class ImageCoderService {

  constructor() { }

  stringToBuffer = (base64?: string): Uint8Array | undefined => {
    if (!base64) {
      return;
    }
    base64 = base64.indexOf(",") === -1 ? base64 : base64.split(",")[1];
    const decodedString = window.atob(base64);
    const buffer = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i++) {
        buffer[i] = decodedString.charCodeAt(i);
    }
    return buffer;  
  }

  bufferToSanitizedString = (sanitizer: DomSanitizer, buffer: any): SafeResourceUrl => {
    const asStr = this.bufferToString(buffer);
    return sanitizer.bypassSecurityTrustResourceUrl(asStr);
  }
  
  bufferToString = (buffer: any): string => {
      const imageB64_coded = Object.keys(buffer?.data ?? {}).reduce(
        (prev, curr) => prev + String.fromCharCode(buffer.data[curr]), 
      "");
      const imageB64 =  window.btoa(imageB64_coded);
      return `data:image/png;charset=utf-8;base64,${imageB64}`;
  }

  stringToSanitizedString = (sanitizer: DomSanitizer, str: string): SafeResourceUrl => {
    const finalStr =  str.indexOf(",") === -1 ? `data:image/png;charset=utf-8;base64,${str}` : str;
    return sanitizer.bypassSecurityTrustResourceUrl(finalStr);
  }
}
