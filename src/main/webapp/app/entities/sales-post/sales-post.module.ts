import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SalesPostComponent } from './list/sales-post.component';
import { SalesPostDetailComponent } from './detail/sales-post-detail.component';
import { SalesPostUpdateComponent } from './update/sales-post-update.component';
import { SalesPostDeleteDialogComponent } from './delete/sales-post-delete-dialog.component';
import { SalesPostRoutingModule } from './route/sales-post-routing.module';

@NgModule({
  imports: [SharedModule, SalesPostRoutingModule],
  declarations: [SalesPostComponent, SalesPostDetailComponent, SalesPostUpdateComponent, SalesPostDeleteDialogComponent],
})
export class SalesPostModule {}
