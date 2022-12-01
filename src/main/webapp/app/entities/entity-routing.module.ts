import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'app-user',
        data: { pageTitle: 'ecomApp.appUser.home.title' },
        loadChildren: () => import('./app-user/app-user.module').then(m => m.AppUserModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'ecomApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'sales-post',
        data: { pageTitle: 'ecomApp.salesPost.home.title' },
        loadChildren: () => import('./sales-post/sales-post.module').then(m => m.SalesPostModule),
      },
      {
        path: 'image',
        data: { pageTitle: 'ecomApp.image.home.title' },
        loadChildren: () => import('./image/image.module').then(m => m.ImageModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'ecomApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'user-order',
        data: { pageTitle: 'ecomApp.userOrder.home.title' },
        loadChildren: () => import('./user-order/user-order.module').then(m => m.UserOrderModule),
      },
      {
        path: 'order-line',
        data: { pageTitle: 'ecomApp.orderLine.home.title' },
        loadChildren: () => import('./order-line/order-line.module').then(m => m.OrderLineModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
