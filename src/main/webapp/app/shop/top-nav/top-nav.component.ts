import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { CartServiceService } from '../service/cart-service.service';

@Component({
  selector: 'jhi-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  totalItem: Observable<number> | undefined;
  isNavbarCollapsed = true;
  authorities: string[] = [];
  account: Account | null = null;
  constructor(
    private storageService: CartServiceService,

    private loginService: LoginService,
    private accountService: AccountService,

    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.totalItem = this.storageService.getCount();
    this.changeLanguage('fr');

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }
  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }
}
