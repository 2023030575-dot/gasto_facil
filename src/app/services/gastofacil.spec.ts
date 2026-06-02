import { TestBed } from '@angular/core/testing';

import { Gastofacil } from './gastofacil';

describe('Gastofacil', () => {
  let service: Gastofacil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gastofacil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
