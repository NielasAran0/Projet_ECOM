import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/admin/user-management/user-management.model';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getLoggedInUser(): Observable<User> {
    return this.http.get<User>('/api/account');
  }
}
