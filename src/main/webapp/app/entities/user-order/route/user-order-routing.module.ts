import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserOrderComponent } from '../list/user-order.component';
import { UserOrderDetailComponent } from '../detail/user-order-detail.component';
import { UserOrderUpdateComponent } from '../update/user-order-update.component';
import { UserOrderRoutingResolveService } from './user-order-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userOrderRoute: Routes = [
  {
    path: '',
    component: UserOrderComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserOrderDetailComponent,
    resolve: {
      userOrder: UserOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserOrderUpdateComponent,
    resolve: {
      userOrder: UserOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserOrderUpdateComponent,
    resolve: {
      userOrder: UserOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userOrderRoute)],
  exports: [RouterModule],
})
export class UserOrderRoutingModule {}
