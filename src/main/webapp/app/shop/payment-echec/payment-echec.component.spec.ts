import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEchecComponent } from './payment-echec.component';

describe('PaymentEchecComponent', () => {
  let component: PaymentEchecComponent;
  let fixture: ComponentFixture<PaymentEchecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentEchecComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentEchecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
