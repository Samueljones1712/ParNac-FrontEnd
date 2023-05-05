import { TestBed } from '@angular/core/testing';

import { LoginConnectionService } from './login-connection.service';

describe('LoginConnectionService', () => {
  let service: LoginConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
