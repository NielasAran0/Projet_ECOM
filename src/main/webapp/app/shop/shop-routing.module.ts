import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesPostRoutingResolveService } from 'app/entities/sales-post/route/sales-post-routing-resolve.service';
import { AccueilComponent } from './accueil/accueil.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {
    path: '',
    component: MainBodyComponent,
    children: [
      {
        path: '',
        component: AccueilComponent,
      },
      {
        path: 'product/:id',
        resolve: {
          salesPost: SalesPostRoutingResolveService,
        },
        component: ProductDetailComponent,
      },
    ],
  },
  {
    path: 'cart',
    component: CartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
