import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalesPost } from '../sales-post.model';
import { SalesPostService } from '../service/sales-post.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './sales-post-delete-dialog.component.html',
})
export class SalesPostDeleteDialogComponent {
  salesPost?: ISalesPost;

  constructor(protected salesPostService: SalesPostService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.salesPostService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
