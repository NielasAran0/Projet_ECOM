import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SalesPostService } from '../service/sales-post.service';

import { SalesPostComponent } from './sales-post.component';

describe('SalesPost Management Component', () => {
  let comp: SalesPostComponent;
  let fixture: ComponentFixture<SalesPostComponent>;
  let service: SalesPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'sales-post', component: SalesPostComponent }]), HttpClientTestingModule],
      declarations: [SalesPostComponent],
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
      .overrideTemplate(SalesPostComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalesPostComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SalesPostService);

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
    expect(comp.salesPosts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to salesPostService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSalesPostIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSalesPostIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
