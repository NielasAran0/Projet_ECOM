import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileService } from '../service/profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    service = TestBed.inject(ProfileService);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService],
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
