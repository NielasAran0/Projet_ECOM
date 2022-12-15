import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderService } from '../service/order.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BuyerOrderComponent } from './buyer-order.component';

describe('BuyerOrderComponent', () => {
  let component: BuyerOrderComponent;
  let fixture: ComponentFixture<BuyerOrderComponent>;
  let orderService: OrderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerOrderComponent],
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    }).compileComponents();
    fixture = TestBed.createComponent(BuyerOrderComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
