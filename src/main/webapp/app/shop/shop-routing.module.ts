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
import { LoginComponent } from 'app/login/login.component';
import { ProfileComponent } from 'app/shop/profile/profile.component';
import { BuyerOrderComponent } from './buyer-order/buyer-order.component';

import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrderComponent } from './order/order.component';
import { UploadProductComponent } from './upload-product/upload-product.component';
import { PostAnnonceComponent } from './post-annonce/post-annonce.component';

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
        path: 'order',
        data: {
          authorities: [Authority.USER],
        },
        canActivate: [UserRouteAccessService],
        component: OrderComponent,
      },
      {
        path: 'product-add',
        data: {
          authorities: [Authority.SELLER],
        },
        canActivate: [UserRouteAccessService],
        component: UploadProductComponent,
      },
      {
        path: 'annonce',
        data: {
          authorities: [Authority.SELLER],
        },
        canActivate: [UserRouteAccessService],
        component: PostAnnonceComponent,
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
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
