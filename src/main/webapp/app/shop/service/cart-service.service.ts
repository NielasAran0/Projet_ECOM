import { Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { IImage } from 'app/entities/image/image.model';
import { ISalesPost } from 'app/entities/sales-post/sales-post.model';
import dayjs from 'dayjs/esm';
import { HttpClient } from '@angular/common/http';
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

  public commande: BehaviorSubject<any[]>;
  public subTotalCommande: BehaviorSubject<number>;

  constructor(private http: HttpClient) {
    const tmp = localStorage.getItem('cart');
    const commandeL = localStorage.getItem('commande');

    let count = 0;
    const list = tmp ? JSON.parse(tmp) : [];
    if (list.length !== 0) {
      list.map((i: any) => {
        count += i.quantity;
      });
    }
    this.storageChange = new BehaviorSubject<number>(count);
    this.storage = new BehaviorSubject<any[]>(list);

    let total = 0;
    list.forEach((element: any) => {
      total = element.price * element.quantity + total;
    });
    this.subTotal = new BehaviorSubject<number>(total);

    let commandeTotal = 0;
    const listCommande = tmp ? JSON.parse(tmp) : [];
    listCommande.forEach((element: any) => {
      commandeTotal = element.price * element.quantity + commandeTotal;
    });
    this.commande = new BehaviorSubject<any[]>(listCommande);
    this.subTotalCommande = new BehaviorSubject<number>(commandeTotal);
  }

  public setStorageItem(change: []): void {
    let total = 0;
    localStorage.setItem('cart', JSON.stringify(change));
    let count = 0;

    change.map((i: any) => {
      count += i.quantity;
    });

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

  deleteItem(deleteItem: ISalesPost): void {
    const id = deleteItem.id;
    const tmp = localStorage.getItem('cart');
    const list = tmp ? JSON.parse(tmp) : [];
    const l = list.filter((x: any) => x.id !== id);
    this.setStorageItem(l);
  }

  getSubTotal(): Observable<number> {
    return this.subTotal;
  }

  updateQuantity(operation: number, updateItem: any): void {
    const id = updateItem.id;
    const items = localStorage.getItem('cart');
    const list = items ? JSON.parse(items) : [];

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

  setCommande(): void {
    const items = localStorage.getItem('cart');
    const list = items ? JSON.parse(items) : [];
    localStorage.setItem('commande', JSON.stringify(list));
    let total = 0;
    list.forEach((element: any) => {
      total = element.price * element.quantity + total;
    });
    this.subTotalCommande.next(total);
    this.commande.next(list);
    this.setStorageItem([]);
  }

  getSubTotalCommande(): Observable<number> {
    return this.subTotalCommande;
  }
  getCommande(): Observable<any[]> {
    return this.commande;
  }
}
