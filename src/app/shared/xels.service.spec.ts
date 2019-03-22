import { TestBed } from '@angular/core/testing';

import { XelsService } from './xels.service';

describe('XelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XelsService = TestBed.get(XelsService);
    expect(service).toBeTruthy();
  });
});
