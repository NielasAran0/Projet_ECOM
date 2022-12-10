import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntityArrayResponseType, SalesPostService } from 'app/entities/sales-post/service/sales-post.service';
import { SortService } from 'app/shared/sort/sort.service';
import { ISalesPost } from 'app/entities/sales-post/sales-post.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { debounceTime, filter, fromEvent, Subscription, tap, throttleTime } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'jhi-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit, OnDestroy {
  products?: ISalesPost[];
  page = 1;
  itemsPerPage = ITEMS_PER_PAGE;

  private eventSub: Subscription;
  totalItems!: number;

  constructor(protected salesPostService: SalesPostService, protected sortService: SortService) {
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
          this.products = res.body as ISalesPost[];
          console.log(this.products);
        },
      });

    fromEvent(window, 'scroll')
      .pipe(
        // emits once, then ignores subsequent emissions for 300ms, repeat...
        filter(() => this.bottomReached()),
        throttleTime(200)
      )
      .subscribe(() => {
        if (this.bottomReached() && this.products!.length < this.totalItems) {
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
                if (tmp) {
                  this.products = [...(this.products || []), ...tmp];
                }
              },
            });
        }
      });
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  bottomReached(): boolean {
    return window.innerHeight + window.scrollY * 1.1 >= document.body.offsetHeight;
  }
  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }
}
