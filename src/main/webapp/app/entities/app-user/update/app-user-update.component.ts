import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AppUserFormService, AppUserFormGroup } from './app-user-form.service';
import { IAppUser } from '../app-user.model';
import { AppUserService } from '../service/app-user.service';
import { IUserOrder } from 'app/entities/user-order/user-order.model';
import { UserOrderService } from 'app/entities/user-order/service/user-order.service';

@Component({
  selector: 'jhi-app-user-update',
  templateUrl: './app-user-update.component.html',
})
export class AppUserUpdateComponent implements OnInit {
  isSaving = false;
  appUser: IAppUser | null = null;

  userOrdersSharedCollection: IUserOrder[] = [];

  editForm: AppUserFormGroup = this.appUserFormService.createAppUserFormGroup();

  constructor(
    protected appUserService: AppUserService,
    protected appUserFormService: AppUserFormService,
    protected userOrderService: UserOrderService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserOrder = (o1: IUserOrder | null, o2: IUserOrder | null): boolean => this.userOrderService.compareUserOrder(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUser }) => {
      this.appUser = appUser;
      if (appUser) {
        this.updateForm(appUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appUser = this.appUserFormService.getAppUser(this.editForm);
    if (appUser.id !== null) {
      this.subscribeToSaveResponse(this.appUserService.update(appUser));
    } else {
      this.subscribeToSaveResponse(this.appUserService.create(appUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(appUser: IAppUser): void {
    this.appUser = appUser;
    this.appUserFormService.resetForm(this.editForm, appUser);

    this.userOrdersSharedCollection = this.userOrderService.addUserOrderToCollectionIfMissing<IUserOrder>(
      this.userOrdersSharedCollection,
      appUser.cart
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userOrderService
      .query()
      .pipe(map((res: HttpResponse<IUserOrder[]>) => res.body ?? []))
      .pipe(
        map((userOrders: IUserOrder[]) =>
          this.userOrderService.addUserOrderToCollectionIfMissing<IUserOrder>(userOrders, this.appUser?.cart)
        )
      )
      .subscribe((userOrders: IUserOrder[]) => (this.userOrdersSharedCollection = userOrders));
  }
}
