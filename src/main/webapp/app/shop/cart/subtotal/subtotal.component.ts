import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'jhi-subtotal',
  templateUrl: './subtotal.component.html',
  styleUrls: ['./subtotal.component.scss'],
})
export class SubtotalComponent implements OnInit {
  count$: Observable<number> | undefined;
  subTotal$: Observable<number> | undefined;

  constructor(private shoppingCartService: CartService) {}

  ngOnInit() {
    this.subTotal$ = this.shoppingCartService.getSubTotal();
    this.count$ = this.shoppingCartService.getCount();
  }
}
