import { TestBed } from '@angular/core/testing';

import { AppUserTransmissionService } from './app-user-transmission.service';

describe('AppUserTransmissionService', () => {
  let service: AppUserTransmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUserTransmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
