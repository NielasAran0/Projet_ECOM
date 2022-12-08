import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

export interface StorageChange {
  key: string;
  value: [];
}

@Injectable({
  providedIn: 'root',
})
export class CartServiceService {
  public storageChange: BehaviorSubject<number>;

  constructor() {
    const tmp = localStorage.getItem('cart');
    const count = tmp ? JSON.parse(tmp).length : 0;
    this.storageChange = new BehaviorSubject<number>(count);
  }

  public setStorageItem(change: []): void {
    localStorage.setItem('cart', JSON.stringify(change));
    this.storageChange.next(change.length);
  }

  getCount(): Observable<number> {
    return this.storageChange;
  }
}
