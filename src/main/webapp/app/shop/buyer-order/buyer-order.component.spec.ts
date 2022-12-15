import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerOrderComponent } from './buyer-order.component';

describe('BuyerOrderComponent', () => {
  let component: BuyerOrderComponent;
  let fixture: ComponentFixture<BuyerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuyerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
