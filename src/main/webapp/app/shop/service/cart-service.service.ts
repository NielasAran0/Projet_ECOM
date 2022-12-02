import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartServiceService {
  private cartService = new BehaviorSubject<string>('');

  constructor() {
    this.cartService.subscribe(s => window.localStorage.getItem('cart'));
  }
}
