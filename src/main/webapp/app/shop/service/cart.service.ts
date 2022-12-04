import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IProduct } from '';
import { map, pluck } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart$: BehaviorSubject<string>;

  constructor(private httpClient: HttpClient) {
    this.cart$ = new BehaviorSubject<cart>({ id: '', IProducts: [], subTotal: 0 });
    this.cart$.subscribe(s => window.localStorage.getProduct('cart'));
    // Initialize shopping cart with default value

    // Load shopping cart data
    this.getShoppingCart();
  }

  private getShoppingCart() {
    this.httpClient.get<ShoppingCart>('/assets/data.json').subscribe(
      shoppingCart => {
        this.setShoppingCart(shoppingCart);
      },
      () => {
        console.error('Shopping cart data could not be loaded.');
      }
    );
  }

  private setShoppingCart(shoppingCart: ShoppingCart) {
    this.cart$.next(shoppingCart);
  }

  getItems(): Observable<Item[]> {
    return this.cart$.pipe(pluck('items'));
  }

  getSubTotal(): Observable<number> {
    return this.cart$.pipe(
      map(cart => {
        const subTotal = cart?.items.map(product => item.quantity * item.sku.price).reduce((p, c) => p + c, 0);
        return subTotal;
      })
    );
  }

  getCount(): Observable<number> {
    return this.shoppingCart$.pipe(
      map(shoppingCart => {
        const count = shoppingCart.items.map(item => item.quantity).reduce((p, c) => p + c, 0);
        return count;
      })
    );
  }

  updateQuantity(updateQuantity: number, updateItem: Item) {
    const shoppingCart = { ...this.shoppingCart$.value };
    shoppingCart.items = shoppingCart.items.map(item => {
      item.quantity = item.id === updateItem.id ? +updateQuantity : item.quantity;
      return item;
    });
    this.setShoppingCart(shoppingCart);
  }

  deleteItem(deleteItem: Item) {
    const shoppingCart = { ...this.shoppingCart$.value };
    shoppingCart.items = shoppingCart.items.filter(item => deleteItem.id !== item.id);
    this.setShoppingCart(shoppingCart);
  }
}
