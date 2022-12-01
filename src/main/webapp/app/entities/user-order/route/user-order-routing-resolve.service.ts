import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserOrder } from '../user-order.model';
import { UserOrderService } from '../service/user-order.service';

@Injectable({ providedIn: 'root' })
export class UserOrderRoutingResolveService implements Resolve<IUserOrder | null> {
  constructor(protected service: UserOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserOrder | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userOrder: HttpResponse<IUserOrder>) => {
          if (userOrder.body) {
            return of(userOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
