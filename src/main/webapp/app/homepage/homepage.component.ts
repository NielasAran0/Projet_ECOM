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
  sortKey: string = '';
  sortOrder: number = 0;
  sortField: string = '';

  constructor(private salesPostService: SalesPostService) {}

  ngOnInit(): void {
    this.salesPostService.findAll().subscribe(salesPosts => {
      this.salesPosts = salesPosts;
    });

    this.sortOptions = [
      { label: 'Prix décroissant', value: '!prix' },
      { label: 'Prix croissant', value: 'prix' },
    ];
  }

  onSortChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let value = target.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
