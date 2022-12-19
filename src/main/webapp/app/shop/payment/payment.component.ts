import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartServiceService } from '../service/cart-service.service';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  payment_form!: FormGroup;
  minValue = '';

  constructor(private _router: Router, private cartService: CartServiceService) {}
  ngOnInit(): void {
    this.payment_form = new FormGroup({
      numero_carte: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
      exp_date: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{2}$')]),
      cvv: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
    });

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = ('0' + String(currentDate.getMonth() + 1)).slice(-2);
    this.minValue = `${currentYear}-${currentMonth}`;
  }

  get f(): any {
    return this.payment_form.controls;
  }

  onSubmit(): void {
    if (this.payment_form.valid) {
      this._router.navigate([this._router.url + '/succes']);
      this.cartService.setCommande();
      // remove personal-info-form
      localStorage.removeItem('personal_info_form');
    }
  }
}
