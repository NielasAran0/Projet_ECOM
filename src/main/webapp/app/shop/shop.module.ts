import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';

import { AccueilComponent } from './accueil/accueil.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ProductModule } from '../entities/product/product.module';
import { ProductCardComponent } from './product/product-card/product-card.component';

@NgModule({
  declarations: [AccueilComponent, TopNavComponent, ProductCardComponent],
  imports: [CommonModule, ShopRoutingModule, ProductModule],
})
export class ShopModule {}
