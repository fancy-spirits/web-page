import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class APIConnectorService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  generateURL(path: string) {
    return `${this.document.location.protocol}//${this.document.location.hostname}:5000${path}`;
  }
}
