import { TestBed } from '@angular/core/testing';

import { ScanData } from './scan-data';

describe('ScanData', () => {
  let service: ScanData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
