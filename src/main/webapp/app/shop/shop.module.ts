import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ShopRoutingModule } from './shop-routing.module';

import { AccueilComponent } from './accueil/accueil.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ProductCardComponent } from './product/product-card/product-card.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentComponent } from './payment/payment.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentSuccesComponent } from './payment-succes/payment-succes.component';
import { PaymentEchecComponent } from './payment-echec/payment-echec.component';

@NgModule({
  declarations: [
    AccueilComponent,
    TopNavComponent,
    ProductCardComponent,
    ProductDetailComponent,
    MainBodyComponent,
    PaymentComponent,
    PersonalInfoComponent,
    PaymentSuccesComponent,
    PaymentEchecComponent,
  ],
  imports: [CommonModule, SharedModule, ShopRoutingModule, RouterModule, ReactiveFormsModule],
})
export class ShopModule {}
