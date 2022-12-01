import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserOrderDetailComponent } from './user-order-detail.component';

describe('UserOrder Management Detail Component', () => {
  let comp: UserOrderDetailComponent;
  let fixture: ComponentFixture<UserOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
