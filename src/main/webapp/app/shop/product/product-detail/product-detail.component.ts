import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISalesPost } from '../../../entities/sales-post/sales-post.model';

@Component({
  selector: 'jhi-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  salesPost: ISalesPost | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesPost }) => {
      this.salesPost = salesPost;
      console.log(salesPost);
    });
  }

  changeImage(element: any) {
    const main_prodcut_image = document.getElementById('main_product_image') as HTMLImageElement | null;
    if (main_prodcut_image != null) {
      main_prodcut_image.src = element.src;
    }
  }

  addToCart(ele: ISalesPost | null) {
    const tmp = localStorage.getItem('cart');
    let cart: any = {};
    if (tmp != null) {
      cart = JSON.parse(tmp);
      cart.items.push(ele);
    } else {
      cart.items = [ele];
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
