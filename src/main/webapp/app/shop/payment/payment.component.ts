import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  payment_form = new FormGroup({
    numero_carte: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
    exp_date: new FormControl('', Validators.required),
    cvv: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
  });

  constructor(private _router: Router) {}
  //ngOnInit(): void {}

  onSubmit(): void {
    console.log(this._router.url);
    this._router.navigate([this._router.url + '/succes']);
    console.log('submitted form');
  }
}
