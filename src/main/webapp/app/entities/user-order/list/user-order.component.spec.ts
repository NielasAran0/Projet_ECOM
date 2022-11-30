import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserOrderService } from '../service/user-order.service';

import { UserOrderComponent } from './user-order.component';

describe('UserOrder Management Component', () => {
  let comp: UserOrderComponent;
  let fixture: ComponentFixture<UserOrderComponent>;
  let service: UserOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-order', component: UserOrderComponent }]), HttpClientTestingModule],
      declarations: [UserOrderComponent],
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
      .overrideTemplate(UserOrderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserOrderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserOrderService);

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
    expect(comp.userOrders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userOrderService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserOrderIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserOrderIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
