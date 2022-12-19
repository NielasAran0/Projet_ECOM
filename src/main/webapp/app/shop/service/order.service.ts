import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserOrder, NewUserOrder } from 'app/entities/user-order/user-order.model';
import { Observable } from 'rxjs';
import { CartServiceService } from './cart-service.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  items$: Observable<any[]> | undefined;

  constructor(private http: HttpClient, private cartService: CartServiceService) {}

  getOrder(): Observable<IUserOrder> {
    return this.http.get<IUserOrder>('/api/user-orders/1');
  }

  cleanPanier(): void {
    const cart: [] = [];
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
