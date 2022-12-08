import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'jhi-personal-info-component',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  nom: String | undefined;
  prenom: String | undefined;
  email: String | undefined;
  pays: String | null | undefined;
  region: String | undefined;
  departement: String | undefined;
  ville: String | undefined;
  code_postal: Number | undefined;
  addresse: String | undefined;
  telephone: Number | undefined;
  constructor() {}

  ngOnInit(): void {}

  updatePays(val: String): void {
    this.pays = val;
    console.log(this.pays);
  }

  register(): void {
    console.log('submitted form');
  }
}
