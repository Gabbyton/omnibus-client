import { TestBed } from '@angular/core/testing';

import { TranslocService } from './transloc.service';

describe('TranslocService', () => {
  let service: TranslocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
