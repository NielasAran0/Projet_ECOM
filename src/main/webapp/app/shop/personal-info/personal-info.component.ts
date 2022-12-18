import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-personal-info-component',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  personal_info_form!: FormGroup;

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.personal_info_form = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.maxLength(128)]),
      prenom: new FormControl('', [Validators.required, Validators.maxLength(128)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      pays: new FormControl('', Validators.required),
      region: new FormControl(''),
      departement: new FormControl(''),
      ville: new FormControl('', Validators.required),
      code_postal: new FormControl('', [Validators.required, Validators.pattern('[0-9]{4,5}')]),
      addresse: new FormControl('', Validators.required),
      telephone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
      // CGV: new FormControl('', Validators.required),
    });

    const storedFormData = localStorage.getItem('personal_info_form');
    if (storedFormData) {
      this.personal_info_form.setValue(JSON.parse(storedFormData));
    }
  }

  get f(): any {
    return this.personal_info_form.controls;
  }

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
    // this.personal_info_form.updateValueAndValidity();
    for (const control in this.personal_info_form.controls) {
      this.personal_info_form.controls[control].updateValueAndValidity();
    }
  }

  onSubmit(): void {
    //Ajouter if sur l'email, si il existe deja -> payment, sinon page de connexion/creation compte a faire

    // for (const control in this.personal_info_form.controls) {
    //   if (this.personal_info_form.controls[control].invalid) {
    //     console.log(`${control} is invalid`);
    //   }
    // }
    if (this.personal_info_form.valid) {
      localStorage.setItem('personal_info_form', JSON.stringify(this.personal_info_form.value));
      this._router.navigate(['/shop/payment']);
    }
  }
}
