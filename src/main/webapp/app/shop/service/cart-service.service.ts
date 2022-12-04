import { Injectable } from '@angular/core';
import { ISalesPost } from 'app/entities/sales-post/sales-post.model';
import { filter } from 'cypress/types/bluebird';

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
  public storage: BehaviorSubject<[]>;
  public subTotal: BehaviorSubject<number>;
  constructor() {
    var total = 0;
    let tmp = localStorage.getItem('cart');
    let list = tmp ? JSON.parse(tmp) : [];
    let count = tmp ? JSON.parse(tmp).length : 0;
    this.storageChange = new BehaviorSubject<number>(count);
    this.storage = new BehaviorSubject<[]>(list);
    list.forEach((element: any) => {
      total = element.price + total;
    });
    this.subTotal = new BehaviorSubject<number>(total);
  }

  public setStorageItem(change: ISalesPost[]): void {
    var total = 0;
    localStorage.setItem('cart', JSON.stringify(change));
    this.storageChange.next(change.length);
    change.forEach((element: any) => {
      total = element.price + total;
    });
    this.subTotal.next(total);
  }

  getCount(): Observable<number> {
    return this.storageChange;
  }
  getCart(): Observable<[]> {
    return this.storage;
  }
  deleteItem(deleteItem: ISalesPost) {
    var id = deleteItem.id;
    let tmp = localStorage.getItem('cart');
    let list = tmp ? JSON.parse(tmp) : [];
    var l = list.filter((x: any) => x.id != id);
    this.setStorageItem(l);
  }

  getSubTotal(): Observable<number> {
    return this.subTotal;
  }
  /*updateQuantity(updateQuantity: number, updateItem: ISalesPost) {
    var id =updateItem.id;
    let tmp = localStorage.getItem('cart');
    let list= tmp ? JSON.parse(tmp) : [];
    
   
  }*/
}
