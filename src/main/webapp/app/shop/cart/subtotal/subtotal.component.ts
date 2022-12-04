import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartServiceService } from '../../service/cart-service.service';

@Component({
  selector: 'jhi-subtotal',
  templateUrl: './subtotal.component.html',
  styleUrls: ['./subtotal.component.scss'],
})
export class SubtotalComponent implements OnInit {
  count$: Observable<number> | undefined;
  subTotal$: Observable<number> | undefined;

  constructor(private shoppingCartService: CartServiceService) {}

  ngOnInit() {
    this.subTotal$ = this.shoppingCartService.getSubTotal();
    this.count$ = this.shoppingCartService.getCount();
  }
}
