import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AppUserService } from '../service/app-user.service';

import { AppUserComponent } from './app-user.component';

describe('AppUser Management Component', () => {
  let comp: AppUserComponent;
  let fixture: ComponentFixture<AppUserComponent>;
  let service: AppUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'app-user', component: AppUserComponent }]), HttpClientTestingModule],
      declarations: [AppUserComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(AppUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AppUserService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.appUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to appUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAppUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAppUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
