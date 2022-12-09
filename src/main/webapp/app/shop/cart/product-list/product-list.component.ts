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

  deleteItem(product: ISalesPost) {
    this.CartService.deleteItem(product);
  }

  decreseQuantity(product: ISalesPost | any) {
    this.CartService.updateQuantity(-1, product);
  }

  increseQuantity(product: ISalesPost | any) {
    this.CartService.updateQuantity(1, product);
  }
}
