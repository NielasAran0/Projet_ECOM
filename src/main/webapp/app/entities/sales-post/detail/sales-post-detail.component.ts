import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISalesPost } from '../sales-post.model';

@Component({
  selector: 'jhi-sales-post-detail',
  templateUrl: './sales-post-detail.component.html',
})
export class SalesPostDetailComponent implements OnInit {
  salesPost: ISalesPost | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesPost }) => {
      this.salesPost = salesPost;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
