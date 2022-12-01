import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISalesPost } from '../sales-post.model';
import { SalesPostService } from '../service/sales-post.service';

@Injectable({ providedIn: 'root' })
export class SalesPostRoutingResolveService implements Resolve<ISalesPost | null> {
  constructor(protected service: SalesPostService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISalesPost | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((salesPost: HttpResponse<ISalesPost>) => {
          if (salesPost.body) {
            return of(salesPost.body);
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
