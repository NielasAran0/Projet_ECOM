import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { MainComponent } from './layouts/main/main.component';

const routes: Routes = [
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
  },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import(`./home/home.module`).then(m => m.HomeModule),
      },
      {
        path: '',
        loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
      },
      {
        path: 'admin',
        data: {
          authorities: [Authority.ADMIN],
        },
        canActivate: [UserRouteAccessService],
        loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
      },

      navbarRoute,
    ],
  },
  ...errorRoute,
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
