import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserOrder, NewUserOrder } from '../user-order.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserOrder for edit and NewUserOrderFormGroupInput for create.
 */
type UserOrderFormGroupInput = IUserOrder | PartialWithRequiredKeyOf<NewUserOrder>;

type UserOrderFormDefaults = Pick<NewUserOrder, 'id'>;

type UserOrderFormGroupContent = {
  id: FormControl<IUserOrder['id'] | NewUserOrder['id']>;
  totalPrice: FormControl<IUserOrder['totalPrice']>;
  discount: FormControl<IUserOrder['discount']>;
  state: FormControl<IUserOrder['state']>;
  date: FormControl<IUserOrder['date']>;
  appUser: FormControl<IUserOrder['appUser']>;
};

export type UserOrderFormGroup = FormGroup<UserOrderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserOrderFormService {
  createUserOrderFormGroup(userOrder: UserOrderFormGroupInput = { id: null }): UserOrderFormGroup {
    const userOrderRawValue = {
      ...this.getFormDefaults(),
      ...userOrder,
    };
    return new FormGroup<UserOrderFormGroupContent>({
      id: new FormControl(
        { value: userOrderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      totalPrice: new FormControl(userOrderRawValue.totalPrice),
      discount: new FormControl(userOrderRawValue.discount),
      state: new FormControl(userOrderRawValue.state),
      date: new FormControl(userOrderRawValue.date),
      appUser: new FormControl(userOrderRawValue.appUser),
    });
  }

  getUserOrder(form: UserOrderFormGroup): IUserOrder | NewUserOrder {
    return form.getRawValue() as IUserOrder | NewUserOrder;
  }

  resetForm(form: UserOrderFormGroup, userOrder: UserOrderFormGroupInput): void {
    const userOrderRawValue = { ...this.getFormDefaults(), ...userOrder };
    form.reset(
      {
        ...userOrderRawValue,
        id: { value: userOrderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserOrderFormDefaults {
    return {
      id: null,
    };
  }
}
