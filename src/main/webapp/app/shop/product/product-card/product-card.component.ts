import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntityArrayResponseType, SalesPostService } from 'app/entities/sales-post/service/sales-post.service';
import { SortService } from 'app/shared/sort/sort.service';
import { ISalesPost } from 'app/entities/sales-post/sales-post.model';

import { ITEMS_PER_PAGE, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { filter, fromEvent, Subscription, throttleTime } from 'rxjs';
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
  totalItems!: number;
  private eventSub: Subscription;

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
        },
      });

    fromEvent(window, 'wheel')
      .pipe(
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

                this.products = [...(this.products ?? []), ...tmp];
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

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }
}
