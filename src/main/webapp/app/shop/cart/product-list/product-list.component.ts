import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ISalesPost } from '../../../entities/sales-post/sales-post.model';
import { CartServiceService } from '../../service/cart-service.service';
import { map } from 'rxjs';
@Component({
  selector: 'jhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  items$: Observable<any[]> | undefined;
  constructor(private CartService: CartServiceService) {}

  ngOnInit(): void {
    this.items$ = this.CartService.getCart();
  }

  deleteItem(product: ISalesPost): void {
    this.CartService.deleteItem(product);
  }

  decreseQuantity(product: ISalesPost | any): void {
    this.CartService.updateQuantity(-1, product);
  }

  increseQuantity(product: ISalesPost | any): void {
    this.CartService.updateQuantity(1, product);
  }
}
