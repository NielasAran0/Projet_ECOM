import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartServiceService } from 'app/shop/service/cart-service.service';

import { SubtotalComponent } from './subtotal.component';

describe('SubtotalComponent', () => {
  let component: SubtotalComponent;
  let fixture: ComponentFixture<SubtotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubtotalComponent],
      imports: [HttpClientTestingModule],
      providers: [CartServiceService],
    }).compileComponents();

    fixture = TestBed.createComponent(SubtotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
