import { Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ISalesPost } from 'app/entities/sales-post/sales-post.model';
import { filter } from 'cypress/types/bluebird';
import { unique } from 'cypress/types/jquery';
import { entries } from 'cypress/types/lodash';
import dayjs from 'dayjs/esm';

import { BehaviorSubject, elementAt, Observable } from 'rxjs';

export interface StorageChange {
  key: string;
  value: [];
}

export interface proudctsInCart {
  id: number;
  stock?: number | null;
  price?: number | null;
  limitDate?: dayjs.Dayjs | null;
  qualite: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartServiceService {
  public storageChange: BehaviorSubject<number>;
  public storage: BehaviorSubject<any[]>;
  public subTotal: BehaviorSubject<number>;
  public quantityMap = new Map<number, number>();

  constructor() {
    let tmp = localStorage.getItem('cart');
    let count = 0;
    let list = tmp ? JSON.parse(tmp) : [];
    if (list.length != 0) {
      list.map((i: any) => {
        count += i.quantity;
      });
    }
    this.storageChange = new BehaviorSubject<number>(count);

    this.storage = new BehaviorSubject<any[]>(list);

    var total = 0;
    list.forEach((element: any) => {
      total = element.price * element.quantity + total;
    });
    this.subTotal = new BehaviorSubject<number>(total);
  }

  public setStorageItem(change: []): void {
    var total = 0;
    localStorage.setItem('cart', JSON.stringify(change));
    let count = 0;
    if (change.length != 0) {
      change.map((i: any) => {
        count += i.quantity;
      });
    }
    this.storageChange.next(count);
    this.storage.next(change);

    change.forEach((element: any) => {
      total = element.price * element.quantity + total;
    });
    this.subTotal.next(total);
  }

  getCount(): Observable<number> {
    return this.storageChange;
  }
  getCart(): Observable<any[]> {
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
  updateQuantity(operation: number, updateItem: any) {
    var id = updateItem.id;
    let items = localStorage.getItem('cart');
    let list = items ? JSON.parse(items) : [];

    // find the index of the item with the specified id
    const index = list.findIndex((i: any) => i.id === id);
    if (operation === 1) {
      updateItem.quantity++;
      list.splice(index, 1, updateItem);
    } else {
      updateItem.quantity--;
      list.splice(index, 1, updateItem);
    }
    // remove the item from the array

    this.setStorageItem(list);
  }
}
