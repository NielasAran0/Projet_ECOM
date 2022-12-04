import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../models';
import { CartService } from '../../service/cart.service';
@Component({
  selector: 'jhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  items$: Observable<Item[]> | undefined;

  constructor(private CartService: CartService) {}

  ngOnInit() {
    this.items$ = this.CartService.getItems();
  }

  updateQuantity($event: Event, item: Item) {
    const quantity = ($event as any)?.target?.value;
    this.CartService.updateQuantity(quantity, item);
  }

  deleteItem(item: Item) {
    this.CartService.deleteItem(item);
  }
}
