import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISalesPost, NewSalesPost } from '../sales-post.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISalesPost for edit and NewSalesPostFormGroupInput for create.
 */
type SalesPostFormGroupInput = ISalesPost | PartialWithRequiredKeyOf<NewSalesPost>;

type SalesPostFormDefaults = Pick<NewSalesPost, 'id'>;

type SalesPostFormGroupContent = {
  id: FormControl<ISalesPost['id'] | NewSalesPost['id']>;
  stock: FormControl<ISalesPost['stock']>;
  price: FormControl<ISalesPost['price']>;
  limitDate: FormControl<ISalesPost['limitDate']>;
  sells: FormControl<ISalesPost['sells']>;
  appUser: FormControl<ISalesPost['appUser']>;
};

export type SalesPostFormGroup = FormGroup<SalesPostFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SalesPostFormService {
  createSalesPostFormGroup(salesPost: SalesPostFormGroupInput = { id: null }): SalesPostFormGroup {
    const salesPostRawValue = {
      ...this.getFormDefaults(),
      ...salesPost,
    };
    return new FormGroup<SalesPostFormGroupContent>({
      id: new FormControl(
        { value: salesPostRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      stock: new FormControl(salesPostRawValue.stock),
      price: new FormControl(salesPostRawValue.price),
      limitDate: new FormControl(salesPostRawValue.limitDate),
      sells: new FormControl(salesPostRawValue.sells),
      appUser: new FormControl(salesPostRawValue.appUser),
    });
  }

  getSalesPost(form: SalesPostFormGroup): ISalesPost | NewSalesPost {
    return form.getRawValue() as ISalesPost | NewSalesPost;
  }

  resetForm(form: SalesPostFormGroup, salesPost: SalesPostFormGroupInput): void {
    const salesPostRawValue = { ...this.getFormDefaults(), ...salesPost };
    form.reset(
      {
        ...salesPostRawValue,
        id: { value: salesPostRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SalesPostFormDefaults {
    return {
      id: null,
    };
  }
}
