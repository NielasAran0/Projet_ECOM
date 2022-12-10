import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesPostRoutingResolveService } from 'app/entities/sales-post/route/sales-post-routing-resolve.service';
import { PaymentEchecComponent } from './payment-echec/payment-echec.component';
import { PaymentSuccesComponent } from './payment-succes/payment-succes.component';
import { PaymentComponent } from 'app/shop/payment/payment.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { AccueilComponent } from './accueil/accueil.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { BuyerOrderComponent } from './buyer-order/buyer-order.component';

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
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'personal-info',
        component: PersonalInfoComponent,
      },
      {
        path: 'payment',
        component: PaymentComponent,
      },
      {
        path: 'payment/succes',
        component: PaymentSuccesComponent,
      },
      {
        path: 'payment/echec',
        component: PaymentEchecComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'buyer-order',
        component: BuyerOrderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
