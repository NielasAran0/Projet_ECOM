import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserOrder, NewUserOrder } from '../user-order.model';

export type PartialUpdateUserOrder = Partial<IUserOrder> & Pick<IUserOrder, 'id'>;

type RestOf<T extends IUserOrder | NewUserOrder> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestUserOrder = RestOf<IUserOrder>;

export type NewRestUserOrder = RestOf<NewUserOrder>;

export type PartialUpdateRestUserOrder = RestOf<PartialUpdateUserOrder>;

export type EntityResponseType = HttpResponse<IUserOrder>;
export type EntityArrayResponseType = HttpResponse<IUserOrder[]>;

@Injectable({ providedIn: 'root' })
export class UserOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userOrder: NewUserOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userOrder);
    return this.http
      .post<RestUserOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(userOrder: IUserOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userOrder);
    return this.http
      .put<RestUserOrder>(`${this.resourceUrl}/${this.getUserOrderIdentifier(userOrder)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(userOrder: PartialUpdateUserOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userOrder);
    return this.http
      .patch<RestUserOrder>(`${this.resourceUrl}/${this.getUserOrderIdentifier(userOrder)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestUserOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUserOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserOrderIdentifier(userOrder: Pick<IUserOrder, 'id'>): number {
    return userOrder.id;
  }

  compareUserOrder(o1: Pick<IUserOrder, 'id'> | null, o2: Pick<IUserOrder, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserOrderIdentifier(o1) === this.getUserOrderIdentifier(o2) : o1 === o2;
  }

  addUserOrderToCollectionIfMissing<Type extends Pick<IUserOrder, 'id'>>(
    userOrderCollection: Type[],
    ...userOrdersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userOrders: Type[] = userOrdersToCheck.filter(isPresent);
    if (userOrders.length > 0) {
      const userOrderCollectionIdentifiers = userOrderCollection.map(userOrderItem => this.getUserOrderIdentifier(userOrderItem)!);
      const userOrdersToAdd = userOrders.filter(userOrderItem => {
        const userOrderIdentifier = this.getUserOrderIdentifier(userOrderItem);
        if (userOrderCollectionIdentifiers.includes(userOrderIdentifier)) {
          return false;
        }
        userOrderCollectionIdentifiers.push(userOrderIdentifier);
        return true;
      });
      return [...userOrdersToAdd, ...userOrderCollection];
    }
    return userOrderCollection;
  }

  protected convertDateFromClient<T extends IUserOrder | NewUserOrder | PartialUpdateUserOrder>(userOrder: T): RestOf<T> {
    return {
      ...userOrder,
      date: userOrder.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restUserOrder: RestUserOrder): IUserOrder {
    return {
      ...restUserOrder,
      date: restUserOrder.date ? dayjs(restUserOrder.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUserOrder>): HttpResponse<IUserOrder> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUserOrder[]>): HttpResponse<IUserOrder[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
