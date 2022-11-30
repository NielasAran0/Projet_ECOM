import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SalesPostComponent } from '../list/sales-post.component';
import { SalesPostDetailComponent } from '../detail/sales-post-detail.component';
import { SalesPostUpdateComponent } from '../update/sales-post-update.component';
import { SalesPostRoutingResolveService } from './sales-post-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const salesPostRoute: Routes = [
  {
    path: '',
    component: SalesPostComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SalesPostDetailComponent,
    resolve: {
      salesPost: SalesPostRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SalesPostUpdateComponent,
    resolve: {
      salesPost: SalesPostRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SalesPostUpdateComponent,
    resolve: {
      salesPost: SalesPostRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(salesPostRoute)],
  exports: [RouterModule],
})
export class SalesPostRoutingModule {}
