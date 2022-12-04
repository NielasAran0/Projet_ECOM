import { Component, OnInit } from '@angular/core';
import { EntityArrayResponseType, ProductService } from 'app/entities/product/service/product.service';
import { IProduct } from '../../entities/product/product.model';
import { SortService } from 'app/shared/sort/sort.service';
@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
