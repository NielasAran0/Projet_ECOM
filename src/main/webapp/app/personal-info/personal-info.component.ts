import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'jhi-personal-info-component',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent {
  nom: string | undefined;
  prenom: string | undefined;
  email: string | undefined;
  pays: string | null | undefined;
  region: string | undefined;
  departement: string | undefined;
  ville: string | undefined;
  code_postal: number | undefined;
  addresse: string | undefined;
  telephone: number | undefined;
  //constructor() {}

  //ngOnInit(): void {}

  updatePays(val: string): void {
    this.pays = val;
  }

  register(): void {
    //console.log('submitted form');
  }
}
