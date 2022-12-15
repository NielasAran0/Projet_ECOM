import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartServiceService } from 'app/shop/service/cart-service.service';

import { ISalesPost } from '../../../entities/sales-post/sales-post.model';

@Component({
  selector: 'jhi-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  salesPost: ISalesPost | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private storageService: CartServiceService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesPost }) => {
      this.salesPost = salesPost;
    });
  }

  changeImage(element: any): void {
    const main_prodcut_image = document.getElementById('main_product_image') as HTMLImageElement | null;
    if (main_prodcut_image != null) {
      main_prodcut_image.src = element.src;
    }
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
        ele.quantity++;
        cart.splice(index, 1, ele);
      }
    } else {
      cart = [ele];
    }
    this.setMessage(cart);
  }

  setMessage(value: []): void {
    this.storageService.setStorageItem(value);
  }
}
