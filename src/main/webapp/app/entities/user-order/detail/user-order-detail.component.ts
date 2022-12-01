import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserOrder } from '../user-order.model';

@Component({
  selector: 'jhi-user-order-detail',
  templateUrl: './user-order-detail.component.html',
})
export class UserOrderDetailComponent implements OnInit {
  userOrder: IUserOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userOrder }) => {
      this.userOrder = userOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
