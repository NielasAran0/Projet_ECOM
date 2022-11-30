import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAppUser } from '../app-user.model';

@Component({
  selector: 'jhi-app-user-detail',
  templateUrl: './app-user-detail.component.html',
})
export class AppUserDetailComponent implements OnInit {
  appUser: IAppUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUser }) => {
      this.appUser = appUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
