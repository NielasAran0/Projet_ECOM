import { Component, OnInit } from '@angular/core';
import { EntityArrayResponseType, SalesPostService } from 'app/entities/sales-post/service/sales-post.service';
import { SortService } from 'app/shared/sort/sort.service';
import { ISalesPost } from 'app/entities/sales-post/sales-post.model';
@Component({
  selector: 'jhi-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  products?: ISalesPost[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  constructor(protected salesPostService: SalesPostService, protected sortService: SortService) {}

  ngOnInit(): void {
    this.salesPostService
      .query({
        eagerload: true,
      })
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.products = this.refineData(dataFromBody);
  }

  protected refineData(data: ISalesPost[]): ISalesPost[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ISalesPost[] | null): ISalesPost[] {
    return data ?? [];
  }
}
