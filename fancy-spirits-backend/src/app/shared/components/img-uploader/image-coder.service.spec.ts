import { TestBed } from '@angular/core/testing';

import { ImageCoderService } from './image-coder.service';

describe('ImageCoderService', () => {
  let service: ImageCoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageCoderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
