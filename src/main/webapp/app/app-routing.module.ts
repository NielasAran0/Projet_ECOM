import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccueilComponent } from './shop/accueil/accueil.component';
import { MainComponent } from './layouts/main/main.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },

  {
    path: 'dashboard',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import(`./home/home.module`).then(m => m.HomeModule),
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

      {
        path: '',
        loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
      },
      navbarRoute,
    ],
  },
  ...errorRoute,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
