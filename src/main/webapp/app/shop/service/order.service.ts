import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, User } from 'app/admin/user-management/user-management.model';
import { IUserOrder } from 'app/entities/user-order/user-order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrder(): Observable<IUserOrder> {
    return this.http.get<IUserOrder>('/api/user-orders/1');
  }
}
