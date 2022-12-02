import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';

import { AccueilComponent } from './accueil/accueil.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ProductCardComponent } from './product/product-card/product-card.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { AppModule } from 'app/app.module';

@NgModule({
  declarations: [AccueilComponent, TopNavComponent, ProductCardComponent, ProductDetailComponent, MainBodyComponent],
  imports: [CommonModule, ShopRoutingModule],
})
export class ShopModule {}