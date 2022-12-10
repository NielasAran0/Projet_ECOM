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
  private eventSub: Subscription;

  constructor(protected salesPostService: SalesPostService, private storageService: CartServiceService) {
    this.eventSub = Subscription.EMPTY;
  }

  ngOnInit(): void {
    this.salesPostService
      .query({
        home: 'home',
        page: this.page - 1,
        size: this.itemsPerPage,
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
            })
            .subscribe({
              next: (res: EntityArrayResponseType) => {
                const tmp = res.body as ISalesPost[];

                this.salesPosts = [...this.salesPosts, ...tmp];
              },
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
  }

  bottomReached(): boolean {
    return window.innerHeight + window.scrollY * 1.1 >= document.body.offsetHeight;
  }

  addToCart(ele: ISalesPost | null): void {
    const tmp = localStorage.getItem('cart');
    let cart = [];
    if (tmp != null) {
      cart = JSON.parse(tmp);
      cart.push(ele);
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
