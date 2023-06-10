import { TestBed } from '@angular/core/testing';

import { ControlInternoService } from './control-interno.service';

describe('ControlInternoService', () => {
  let service: ControlInternoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlInternoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
