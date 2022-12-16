import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITEMS_PER_PAGE, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';

import { ISalesPost } from 'app/entities/sales-post/sales-post.model';
import { EntityArrayResponseType, SalesPostService } from 'app/entities/sales-post/service/sales-post.service';

import { filter, fromEvent, Subscription, throttleTime } from 'rxjs';
import { CartServiceService } from '../service/cart-service.service';

@Component({
  selector: 'jhi-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
})
export class AccueilComponent implements OnInit, OnDestroy {
  salesPosts: ISalesPost[] = [];

  page = 1;
  itemsPerPage = ITEMS_PER_PAGE;
  totalItems!: number;

  priceRange: number[];
  productNameInput: string;

  minPrice: number;
  maxPrice: number;
  productName: string;

  private eventSub: Subscription;

  constructor(protected salesPostService: SalesPostService, private storageService: CartServiceService) {
    this.priceRange = [0, 5000];
    this.productNameInput = '';

    this.minPrice = 0;
    this.maxPrice = 5000;
    this.productName = '';

    this.eventSub = Subscription.EMPTY;
  }

  ngOnInit(): void {
    this.salesPostService
      .query({
        home: 'home',
        page: this.page - 1,
        size: this.itemsPerPage,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        productName: this.productName,
      })
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.fillComponentAttributesFromResponseHeader(res.headers);
          this.salesPosts = res.body as ISalesPost[];
        },
      });

    fromEvent(window, 'wheel')
      .pipe(
        filter(() => this.bottomReached()),
        throttleTime(200)
      )
      .subscribe(() => {
        if (this.bottomReached() && this.salesPosts.length < this.totalItems) {
          this.page++;

          this.salesPostService
            .query({
              home: 'home',
              page: this.page - 1,
              size: this.itemsPerPage,
              minPrice: this.minPrice,
              maxPrice: this.maxPrice,
              productName: this.productName,
            })
            .subscribe({
              next: (res: EntityArrayResponseType) => {
                const tmp = res.body as ISalesPost[];

                this.salesPosts = [...this.salesPosts, ...tmp];
              },
            });
        }
      });
      const tmp = localStorage.getItem('cart');
      if(tmp===null){
        const array=[];
        localStorage.setItem('cart',JSON.stringify(array))
      }
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
  }

  bottomReached(): boolean {
    return window.innerHeight + window.scrollY * 1.1 >= document.body.offsetHeight;
  }

  handleSearch(): void {
    this.salesPosts = [];

    this.minPrice = this.priceRange[0];
    this.maxPrice = this.priceRange[1];
    this.productName = this.productNameInput;

    this.salesPostService
      .query({
        home: 'home',
        page: this.page - 1,
        size: this.itemsPerPage,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        productName: this.productName,
      })
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.fillComponentAttributesFromResponseHeader(res.headers);
          this.salesPosts = res.body as ISalesPost[];
        },
      });
  }

  addToCart(ele: ISalesPost | any): void {
    const tmp = localStorage.getItem('cart');
    let cart = [];
    if (tmp != null) {
      cart = JSON.parse(tmp);
      const index = cart.findIndex((i: any) => i.id === ele.id);
      if (index === -1) {
        ele.quantity = 1;
        cart.push(ele);
      } else {
        const item = cart[index];
        item.quantity++;
        cart.splice(index, 1, item);
      }
    } else {
      cart = [ele];
    }
    this.setMessage(cart);
  }

  setMessage(value: []): void {
    this.storageService.setStorageItem(value);
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }
}
