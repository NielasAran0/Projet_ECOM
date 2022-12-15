import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUserTransmissionService } from '../app-user-transmission.service';

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

  constructor(private _router: Router, private http: HttpClient, private appUserTransmissionService: AppUserTransmissionService) {}
  // ngOnInit(): void {}

  onSubmit(): void {
    let tel = this.appUserTransmissionService.getTel();
    let nom = this.appUserTransmissionService.getNom();
    let prenom = this.appUserTransmissionService.getPrenom();
    let addresse = this.appUserTransmissionService.getAddresse();
    this.http.post('http://localhost:9000/api/app-user-info', [tel, addresse]).subscribe(response => {
      let user_id = response;
      this.http.get('http://localhost:9000/api/user-orders/app-user/' + user_id.toString()).subscribe(response => {
        this.http.get('http://localhost:9000/api/order-lines/user-orders', response).subscribe(response => {
          if (response instanceof Array) {
            response.forEach(element => {
              this.http.put('http://localhost:9000/api/sales-posts/stock', element);
            });
          }
        });
      });
    });
    this._router.navigate([this._router.url + '/succes']);
  }
}
