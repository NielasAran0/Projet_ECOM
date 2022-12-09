import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-personal-info-component',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent {
  personal_info_form = new FormGroup({
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    pays: new FormControl('', Validators.required),
    region: new FormControl(''),
    departement: new FormControl(''),
    ville: new FormControl('', Validators.required),
    code_postal: new FormControl('', [Validators.required, Validators.pattern('[0-9]{4,5}')]),
    addresse: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.pattern('[0-9]{10}')),
    CGV: new FormControl('', Validators.required),
  });

  constructor(private _router: Router) {}

  //ngOnInit(): void {}

  countryValidator(): void {
    if (this.personal_info_form.controls['pays'].value === 'france') {
      this.personal_info_form.controls['region'].setValidators(Validators.required);
      this.personal_info_form.controls['departement'].setValidators(Validators.required);
      this.personal_info_form.controls['code_postal'].setValidators([Validators.required, Validators.pattern('[0-9]{5}')]);
    } else {
      this.personal_info_form.controls['region'].clearValidators();
      this.personal_info_form.controls['departement'].clearValidators();
      this.personal_info_form.controls['code_postal'].setValidators([Validators.required, Validators.pattern('[0-9]{4}')]);
    }
  }

  updatePays(val: string): void {
    this.personal_info_form.patchValue({ pays: val });
    this.countryValidator();
    this.personal_info_form.updateValueAndValidity();
  }

  onSubmit(): void {
    //Ajouter if sur l'email, si il existe deja -> payment, sinon page de connexion/creation compte a faire
    this._router.navigate(['../payment']);
  }
}
