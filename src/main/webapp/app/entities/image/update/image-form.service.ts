import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IImage, NewImage } from '../image.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IImage for edit and NewImageFormGroupInput for create.
 */
type ImageFormGroupInput = IImage | PartialWithRequiredKeyOf<NewImage>;

type ImageFormDefaults = Pick<NewImage, 'id' | 'products'>;

type ImageFormGroupContent = {
  id: FormControl<IImage['id'] | NewImage['id']>;
  url: FormControl<IImage['url']>;
  products: FormControl<IImage['products']>;
};

export type ImageFormGroup = FormGroup<ImageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ImageFormService {
  createImageFormGroup(image: ImageFormGroupInput = { id: null }): ImageFormGroup {
    const imageRawValue = {
      ...this.getFormDefaults(),
      ...image,
    };
    return new FormGroup<ImageFormGroupContent>({
      id: new FormControl(
        { value: imageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      url: new FormControl(imageRawValue.url),
      products: new FormControl(imageRawValue.products ?? []),
    });
  }

  getImage(form: ImageFormGroup): IImage | NewImage {
    return form.getRawValue() as IImage | NewImage;
  }

  resetForm(form: ImageFormGroup, image: ImageFormGroupInput): void {
    const imageRawValue = { ...this.getFormDefaults(), ...image };
    form.reset(
      {
        ...imageRawValue,
        id: { value: imageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ImageFormDefaults {
    return {
      id: null,
      products: [],
    };
  }
}
