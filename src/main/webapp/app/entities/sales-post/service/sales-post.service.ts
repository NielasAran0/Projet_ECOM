import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISalesPost, NewSalesPost } from '../sales-post.model';

export type PartialUpdateSalesPost = Partial<ISalesPost> & Pick<ISalesPost, 'id'>;

type RestOf<T extends ISalesPost | NewSalesPost> = Omit<T, 'limitDate'> & {
  limitDate?: string | null;
};

export type RestSalesPost = RestOf<ISalesPost>;

export type NewRestSalesPost = RestOf<NewSalesPost>;

export type PartialUpdateRestSalesPost = RestOf<PartialUpdateSalesPost>;

export type EntityResponseType = HttpResponse<ISalesPost>;
export type EntityArrayResponseType = HttpResponse<ISalesPost[]>;

@Injectable({ providedIn: 'root' })
export class SalesPostService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sales-posts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(salesPost: NewSalesPost): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(salesPost);
    return this.http
      .post<RestSalesPost>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(salesPost: ISalesPost): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(salesPost);
    return this.http
      .put<RestSalesPost>(`${this.resourceUrl}/${this.getSalesPostIdentifier(salesPost)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(salesPost: PartialUpdateSalesPost): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(salesPost);
    return this.http
      .patch<RestSalesPost>(`${this.resourceUrl}/${this.getSalesPostIdentifier(salesPost)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSalesPost>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  findAll(): Observable<ISalesPost[]> {
    return this.http.get<ISalesPost[]>(this.resourceUrl);
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSalesPost[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSalesPostIdentifier(salesPost: Pick<ISalesPost, 'id'>): number {
    return salesPost.id;
  }

  compareSalesPost(o1: Pick<ISalesPost, 'id'> | null, o2: Pick<ISalesPost, 'id'> | null): boolean {
    return o1 && o2 ? this.getSalesPostIdentifier(o1) === this.getSalesPostIdentifier(o2) : o1 === o2;
  }

  addSalesPostToCollectionIfMissing<Type extends Pick<ISalesPost, 'id'>>(
    salesPostCollection: Type[],
    ...salesPostsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const salesPosts: Type[] = salesPostsToCheck.filter(isPresent);
    if (salesPosts.length > 0) {
      const salesPostCollectionIdentifiers = salesPostCollection.map(salesPostItem => this.getSalesPostIdentifier(salesPostItem)!);
      const salesPostsToAdd = salesPosts.filter(salesPostItem => {
        const salesPostIdentifier = this.getSalesPostIdentifier(salesPostItem);
        if (salesPostCollectionIdentifiers.includes(salesPostIdentifier)) {
          return false;
        }
        salesPostCollectionIdentifiers.push(salesPostIdentifier);
        return true;
      });
      return [...salesPostsToAdd, ...salesPostCollection];
    }
    return salesPostCollection;
  }

  protected convertDateFromClient<T extends ISalesPost | NewSalesPost | PartialUpdateSalesPost>(salesPost: T): RestOf<T> {
    return {
      ...salesPost,
      limitDate: salesPost.limitDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restSalesPost: RestSalesPost): ISalesPost {
    return {
      ...restSalesPost,
      limitDate: restSalesPost.limitDate ? dayjs(restSalesPost.limitDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSalesPost>): HttpResponse<ISalesPost> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSalesPost[]>): HttpResponse<ISalesPost[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
