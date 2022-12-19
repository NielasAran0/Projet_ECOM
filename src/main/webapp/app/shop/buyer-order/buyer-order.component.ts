import { Component, OnInit } from '@angular/core';
import { IUserOrder } from 'app/entities/user-order/user-order.model';
import { Observable } from 'rxjs';
import { CartServiceService } from '../service/cart-service.service';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'jhi-buyer-order',
  templateUrl: './buyer-order.component.html',
  styleUrls: ['./buyer-order.component.scss'],
})
export class BuyerOrderComponent implements OnInit {
  order: IUserOrder = {} as IUserOrder;
  items$: Observable<any[]> | undefined;
  subTotal$: Observable<number> | undefined;
  constructor(private orderService: OrderService, private CartService: CartServiceService) {}

  ngOnInit(): void {
    this.orderService.getOrder().subscribe((order: IUserOrder) => (this.order = order));
    this.items$ = this.CartService.getCommande();
    this.subTotal$ = this.CartService.getSubTotalCommande();
  }
}
