import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppUser } from '../app-user.model';
import { AppUserService } from '../service/app-user.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './app-user-delete-dialog.component.html',
})
export class AppUserDeleteDialogComponent {
  appUser?: IAppUser;

  constructor(protected appUserService: AppUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.appUserService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
