import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SalesPostDetailComponent } from './sales-post-detail.component';

describe('SalesPost Management Detail Component', () => {
  let comp: SalesPostDetailComponent;
  let fixture: ComponentFixture<SalesPostDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesPostDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ salesPost: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SalesPostDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SalesPostDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load salesPost on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.salesPost).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
