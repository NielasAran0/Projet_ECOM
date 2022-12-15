import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ShopRoutingModule } from './shop-routing.module';

import { AccueilComponent } from './accueil/accueil.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ProductCardComponent } from './product/product-card/product-card.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { AppModule } from 'app/app.module';
import { CartComponent } from './cart/cart.component';
import { SubtotalComponent } from './cart/subtotal/subtotal.component';
import { ProductListComponent } from './cart/product-list/product-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentComponent } from './payment/payment.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentSuccesComponent } from './payment-succes/payment-succes.component';
import { PaymentEchecComponent } from './payment-echec/payment-echec.component';

import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { ProfileComponent } from './profile/profile.component';
import { BuyerOrderComponent } from './buyer-order/buyer-order.component';

@NgModule({
  declarations: [
    AccueilComponent,
    TopNavComponent,
    ProductCardComponent,
    ProductDetailComponent,
    MainBodyComponent,
    CartComponent,
    SubtotalComponent,
    ProductListComponent,
    PaymentComponent,
    PersonalInfoComponent,
    PaymentSuccesComponent,
    PaymentEchecComponent,
    ProfileComponent,
    BuyerOrderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShopRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // primeng modules
    DropdownModule,
    SliderModule,
    ButtonModule,
    DataViewModule,
  ],
})
export class ShopModule {}
