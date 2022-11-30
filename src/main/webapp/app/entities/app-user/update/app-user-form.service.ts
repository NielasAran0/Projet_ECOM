import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAppUser, NewAppUser } from '../app-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAppUser for edit and NewAppUserFormGroupInput for create.
 */
type AppUserFormGroupInput = IAppUser | PartialWithRequiredKeyOf<NewAppUser>;

type AppUserFormDefaults = Pick<NewAppUser, 'id'>;

type AppUserFormGroupContent = {
  id: FormControl<IAppUser['id'] | NewAppUser['id']>;
  email: FormControl<IAppUser['email']>;
  firstName: FormControl<IAppUser['firstName']>;
  lastName: FormControl<IAppUser['lastName']>;
  password: FormControl<IAppUser['password']>;
  telephone: FormControl<IAppUser['telephone']>;
  adresse: FormControl<IAppUser['adresse']>;
  cart: FormControl<IAppUser['cart']>;
};

export type AppUserFormGroup = FormGroup<AppUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AppUserFormService {
  createAppUserFormGroup(appUser: AppUserFormGroupInput = { id: null }): AppUserFormGroup {
    const appUserRawValue = {
      ...this.getFormDefaults(),
      ...appUser,
    };
    return new FormGroup<AppUserFormGroupContent>({
      id: new FormControl(
        { value: appUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      email: new FormControl(appUserRawValue.email),
      firstName: new FormControl(appUserRawValue.firstName),
      lastName: new FormControl(appUserRawValue.lastName),
      password: new FormControl(appUserRawValue.password),
      telephone: new FormControl(appUserRawValue.telephone),
      adresse: new FormControl(appUserRawValue.adresse),
      cart: new FormControl(appUserRawValue.cart),
    });
  }

  getAppUser(form: AppUserFormGroup): IAppUser | NewAppUser {
    return form.getRawValue() as IAppUser | NewAppUser;
  }

  resetForm(form: AppUserFormGroup, appUser: AppUserFormGroupInput): void {
    const appUserRawValue = { ...this.getFormDefaults(), ...appUser };
    form.reset(
      {
        ...appUserRawValue,
        id: { value: appUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AppUserFormDefaults {
    return {
      id: null,
    };
  }
}
