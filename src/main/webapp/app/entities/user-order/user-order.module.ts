import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserOrderComponent } from './list/user-order.component';
import { UserOrderDetailComponent } from './detail/user-order-detail.component';
import { UserOrderUpdateComponent } from './update/user-order-update.component';
import { UserOrderDeleteDialogComponent } from './delete/user-order-delete-dialog.component';
import { UserOrderRoutingModule } from './route/user-order-routing.module';

@NgModule({
  imports: [SharedModule, UserOrderRoutingModule],
  declarations: [UserOrderComponent, UserOrderDetailComponent, UserOrderUpdateComponent, UserOrderDeleteDialogComponent],
})
export class UserOrderModule {}
