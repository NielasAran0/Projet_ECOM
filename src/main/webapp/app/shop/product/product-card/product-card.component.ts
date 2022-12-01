import { Component, OnInit } from '@angular/core';
import { EntityArrayResponseType, ProductService } from 'app/entities/product/service/product.service';
import { IProduct } from '../../../entities/product/product.model';
import { SortService } from 'app/shared/sort/sort.service';
@Component({
  selector: 'jhi-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  products?: IProduct[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  constructor(protected productService: ProductService, protected sortService: SortService) {}

  ngOnInit(): void {
    var tmp = this.productService
      .query({
        eagerload: true,
        sort: ['id', 'asc'],
      })
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
          console.log(this.products);
        },
      });
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.products = this.refineData(dataFromBody);
  }

  protected refineData(data: IProduct[]): IProduct[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IProduct[] | null): IProduct[] {
    return data ?? [];
  }
}
