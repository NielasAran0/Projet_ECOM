import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartServiceService } from '../service/cart-service.service';

@Component({
  selector: 'jhi-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  totalItem: Observable<number> | undefined;
  // totalItem?: number;
  constructor(private storageService: CartServiceService, private router: Router) {}

  ngOnInit(): void {
    this.totalItem = this.storageService.getCount();
  }
}
