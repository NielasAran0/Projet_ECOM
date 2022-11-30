import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserOrderFormService, UserOrderFormGroup } from './user-order-form.service';
import { IUserOrder } from '../user-order.model';
import { UserOrderService } from '../service/user-order.service';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { AppUserService } from 'app/entities/app-user/service/app-user.service';
import { OrderState } from 'app/entities/enumerations/order-state.model';

@Component({
  selector: 'jhi-user-order-update',
  templateUrl: './user-order-update.component.html',
})
export class UserOrderUpdateComponent implements OnInit {
  isSaving = false;
  userOrder: IUserOrder | null = null;
  orderStateValues = Object.keys(OrderState);

  appUsersSharedCollection: IAppUser[] = [];

  editForm: UserOrderFormGroup = this.userOrderFormService.createUserOrderFormGroup();

  constructor(
    protected userOrderService: UserOrderService,
    protected userOrderFormService: UserOrderFormService,
    protected appUserService: AppUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAppUser = (o1: IAppUser | null, o2: IAppUser | null): boolean => this.appUserService.compareAppUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userOrder }) => {
      this.userOrder = userOrder;
      if (userOrder) {
        this.updateForm(userOrder);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userOrder = this.userOrderFormService.getUserOrder(this.editForm);
    if (userOrder.id !== null) {
      this.subscribeToSaveResponse(this.userOrderService.update(userOrder));
    } else {
      this.subscribeToSaveResponse(this.userOrderService.create(userOrder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserOrder>>): void {
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

  protected updateForm(userOrder: IUserOrder): void {
    this.userOrder = userOrder;
    this.userOrderFormService.resetForm(this.editForm, userOrder);

    this.appUsersSharedCollection = this.appUserService.addAppUserToCollectionIfMissing<IAppUser>(
      this.appUsersSharedCollection,
      userOrder.appUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appUserService
      .query()
      .pipe(map((res: HttpResponse<IAppUser[]>) => res.body ?? []))
      .pipe(map((appUsers: IAppUser[]) => this.appUserService.addAppUserToCollectionIfMissing<IAppUser>(appUsers, this.userOrder?.appUser)))
      .subscribe((appUsers: IAppUser[]) => (this.appUsersSharedCollection = appUsers));
  }
}
