import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOrderLine, NewOrderLine } from '../order-line.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrderLine for edit and NewOrderLineFormGroupInput for create.
 */
type OrderLineFormGroupInput = IOrderLine | PartialWithRequiredKeyOf<NewOrderLine>;

type OrderLineFormDefaults = Pick<NewOrderLine, 'id' | 'delivered'>;

type OrderLineFormGroupContent = {
  id: FormControl<IOrderLine['id'] | NewOrderLine['id']>;
  quantity: FormControl<IOrderLine['quantity']>;
  unitPrice: FormControl<IOrderLine['unitPrice']>;
  delivered: FormControl<IOrderLine['delivered']>;
  product: FormControl<IOrderLine['product']>;
  userOrder: FormControl<IOrderLine['userOrder']>;
};

export type OrderLineFormGroup = FormGroup<OrderLineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrderLineFormService {
  createOrderLineFormGroup(orderLine: OrderLineFormGroupInput = { id: null }): OrderLineFormGroup {
    const orderLineRawValue = {
      ...this.getFormDefaults(),
      ...orderLine,
    };
    return new FormGroup<OrderLineFormGroupContent>({
      id: new FormControl(
        { value: orderLineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      quantity: new FormControl(orderLineRawValue.quantity),
      unitPrice: new FormControl(orderLineRawValue.unitPrice),
      delivered: new FormControl(orderLineRawValue.delivered),
      product: new FormControl(orderLineRawValue.product),
      userOrder: new FormControl(orderLineRawValue.userOrder),
    });
  }

  getOrderLine(form: OrderLineFormGroup): IOrderLine | NewOrderLine {
    return form.getRawValue() as IOrderLine | NewOrderLine;
  }

  resetForm(form: OrderLineFormGroup, orderLine: OrderLineFormGroupInput): void {
    const orderLineRawValue = { ...this.getFormDefaults(), ...orderLine };
    form.reset(
      {
        ...orderLineRawValue,
        id: { value: orderLineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OrderLineFormDefaults {
    return {
      id: null,
      delivered: false,
    };
  }
}
