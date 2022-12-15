import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppUserTransmissionService } from '../app-user-transmission.service';

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

  constructor(private _router: Router, private http: HttpClient, private appUserTransmissionService: AppUserTransmissionService) {}

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
    const tel: string | null = this.personal_info_form.controls['telephone'].value;
    const addr: string | null = this.personal_info_form.controls['addresse'].value;
    const code_postal: string | null = this.personal_info_form.controls['code_postal'].value;
    const ville: string | null = this.personal_info_form.controls['ville'].value;
    const pays: string | null = this.personal_info_form.controls['pays'].value;
    const nom: string | null = this.personal_info_form.controls['nom'].value;
    const prenom: string | null = this.personal_info_form.controls['prenom'].value;
    this.appUserTransmissionService.setTel(tel);
    this.appUserTransmissionService.setAddresse(
      String(nom) + ' ' + String(prenom) + ' ' + String(addr) + ' ' + String(code_postal) + ' ' + String(ville) + ' ' + String(pays)
    );
    this._router.navigate(['/shop/payment']);
  }
}
