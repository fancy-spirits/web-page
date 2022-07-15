import { TestBed } from '@angular/core/testing';

import { APIConnectorService } from './apiconnector.service';

describe('APIConnectorService', () => {
  let service: APIConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APIConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
