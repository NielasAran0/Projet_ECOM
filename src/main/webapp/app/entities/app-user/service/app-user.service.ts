import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppUser, NewAppUser } from '../app-user.model';

export type PartialUpdateAppUser = Partial<IAppUser> & Pick<IAppUser, 'id'>;

export type EntityResponseType = HttpResponse<IAppUser>;
export type EntityArrayResponseType = HttpResponse<IAppUser[]>;

@Injectable({ providedIn: 'root' })
export class AppUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/app-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(appUser: NewAppUser): Observable<EntityResponseType> {
    return this.http.post<IAppUser>(this.resourceUrl, appUser, { observe: 'response' });
  }

  update(appUser: IAppUser): Observable<EntityResponseType> {
    return this.http.put<IAppUser>(`${this.resourceUrl}/${this.getAppUserIdentifier(appUser)}`, appUser, { observe: 'response' });
  }

  partialUpdate(appUser: PartialUpdateAppUser): Observable<EntityResponseType> {
    return this.http.patch<IAppUser>(`${this.resourceUrl}/${this.getAppUserIdentifier(appUser)}`, appUser, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAppUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAppUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAppUserIdentifier(appUser: Pick<IAppUser, 'id'>): number {
    return appUser.id;
  }

  compareAppUser(o1: Pick<IAppUser, 'id'> | null, o2: Pick<IAppUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getAppUserIdentifier(o1) === this.getAppUserIdentifier(o2) : o1 === o2;
  }

  addAppUserToCollectionIfMissing<Type extends Pick<IAppUser, 'id'>>(
    appUserCollection: Type[],
    ...appUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const appUsers: Type[] = appUsersToCheck.filter(isPresent);
    if (appUsers.length > 0) {
      const appUserCollectionIdentifiers = appUserCollection.map(appUserItem => this.getAppUserIdentifier(appUserItem)!);
      const appUsersToAdd = appUsers.filter(appUserItem => {
        const appUserIdentifier = this.getAppUserIdentifier(appUserItem);
        if (appUserCollectionIdentifiers.includes(appUserIdentifier)) {
          return false;
        }
        appUserCollectionIdentifiers.push(appUserIdentifier);
        return true;
      });
      return [...appUsersToAdd, ...appUserCollection];
    }
    return appUserCollection;
  }
}
