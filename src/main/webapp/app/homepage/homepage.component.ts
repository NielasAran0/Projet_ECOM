import { Component, OnInit } from '@angular/core';

import { ISalesPost } from '../entities/sales-post/sales-post.model';
import { SalesPostService } from '../entities/sales-post/service/sales-post.service';

import { SelectItem } from 'primeng/api';

@Component({
  selector: 'jhi-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  salesPosts: ISalesPost[] = [];

  sortOptions: SelectItem[] = [];
  sortOrder: number;
  sortKey: string;
  sortField: string;

  constructor(private salesPostService: SalesPostService) {
    this.sortOrder = 0;
    this.sortKey = '';
    this.sortField = '';
  }

  ngOnInit(): void {
    this.salesPostService.findAll().subscribe(salesPosts => {
      this.salesPosts = salesPosts;
    });

    this.sortOptions = [
      { label: 'Prix décroissant', value: '!price' },
      { label: 'Prix croissant', value: 'price' },
    ];
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
