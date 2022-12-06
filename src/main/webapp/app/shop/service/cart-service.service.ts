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
    let count = tmp ? JSON.parse(tmp).length : 0;
    this.storageChange = new BehaviorSubject<number>(count);
    let list = tmp ? JSON.parse(tmp) : [];

    list.forEach((element: any) => {
      if (typeof this.quantityMap.get(element.id) == 'undefined') {
        this.quantityMap.set(element.id, 1);
      } else {
        var quantity = this.quantityMap.get(element.id) as number;
        this.quantityMap.set(element.id, quantity + 1);
      }
    });

    var newList: any[] = [];
    var arrId = [];
    for (var item of list) {
      if (arrId.indexOf(item['id']) == -1) {
        arrId.push(item['id']);
        item.quantity = this.quantityMap.get(item.id);
        newList.push(item);
      }
    }
    this.storage = new BehaviorSubject<any[]>(newList);

    var total = 0;
    list.forEach((element: any) => {
      total = element.price + total;
    });
    this.subTotal = new BehaviorSubject<number>(total);
  }

  public setStorageItem(change: []): void {
    var total = 0;
    localStorage.setItem('cart', JSON.stringify(change));
    this.storageChange.next(change.length);
    this.quantityMap = new Map<number, number>();
    let tmp = localStorage.getItem('cart');
    let list = tmp ? JSON.parse(tmp) : [];
    list.forEach((element: any) => {
      if (typeof this.quantityMap.get(element.id) == 'undefined') {
        this.quantityMap.set(element.id, 1);
      } else {
        var quantity = this.quantityMap.get(element.id) as number;
        this.quantityMap.set(element.id, quantity + 1);
      }
    });

    var newList: any[] = [];
    var arrId = [];
    for (var item of list) {
      if (arrId.indexOf(item['id']) == -1) {
        arrId.push(item['id']);
        item.quantity = this.quantityMap.get(item.id);
        newList.push(item);
      }
    }
    this.storage.next(newList);

    change.forEach((element: any) => {
      total = element.price + total;
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
  /*updateQuantity(updateQuantity: number, updateItem: ISalesPost) {
    var id =updateItem.id;
    let tmp = localStorage.getItem('cart');
    let list= tmp ? JSON.parse(tmp) : [];
    
   
  }*/
}
