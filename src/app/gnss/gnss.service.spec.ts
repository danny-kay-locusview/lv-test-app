import { TestBed } from '@angular/core/testing';

import { GnssService } from './gnss.service';

describe('GnssService', () => {
  let service: GnssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GnssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
