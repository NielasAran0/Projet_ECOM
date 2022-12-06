import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ISalesPost } from '../../../entities/sales-post/sales-post.model';
import { CartServiceService } from '../../service/cart-service.service';
@Component({
  selector: 'jhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  items$: Observable<any[]> | undefined;
  constructor(private CartService: CartServiceService) {}

  ngOnInit() {
    this.items$ = this.CartService.getCart();
  }
  /*updateQuantity($event: Event, product: ISalesPost) {
    const quantity = ($event as any)?.target?.value;
    this.CartService.updateQuantity(quantity, product);
  }*/

  deleteItem(product: ISalesPost) {
    this.CartService.deleteItem(product);
  }
}
