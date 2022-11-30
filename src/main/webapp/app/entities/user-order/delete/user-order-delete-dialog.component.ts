import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserOrder } from '../user-order.model';
import { UserOrderService } from '../service/user-order.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-order-delete-dialog.component.html',
})
export class UserOrderDeleteDialogComponent {
  userOrder?: IUserOrder;

  constructor(protected userOrderService: UserOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userOrderService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
