import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SalesPostFormService, SalesPostFormGroup } from './sales-post-form.service';
import { ISalesPost } from '../sales-post.model';
import { SalesPostService } from '../service/sales-post.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { AppUserService } from 'app/entities/app-user/service/app-user.service';

@Component({
  selector: 'jhi-sales-post-update',
  templateUrl: './sales-post-update.component.html',
})
export class SalesPostUpdateComponent implements OnInit {
  isSaving = false;
  salesPost: ISalesPost | null = null;

  productsCollection: IProduct[] = [];
  appUsersSharedCollection: IAppUser[] = [];

  editForm: SalesPostFormGroup = this.salesPostFormService.createSalesPostFormGroup();

  constructor(
    protected salesPostService: SalesPostService,
    protected salesPostFormService: SalesPostFormService,
    protected productService: ProductService,
    protected appUserService: AppUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProduct = (o1: IProduct | null, o2: IProduct | null): boolean => this.productService.compareProduct(o1, o2);

  compareAppUser = (o1: IAppUser | null, o2: IAppUser | null): boolean => this.appUserService.compareAppUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesPost }) => {
      this.salesPost = salesPost;
      if (salesPost) {
        this.updateForm(salesPost);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const salesPost = this.salesPostFormService.getSalesPost(this.editForm);
    if (salesPost.id !== null) {
      this.subscribeToSaveResponse(this.salesPostService.update(salesPost));
    } else {
      this.subscribeToSaveResponse(this.salesPostService.create(salesPost));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISalesPost>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(salesPost: ISalesPost): void {
    this.salesPost = salesPost;
    this.salesPostFormService.resetForm(this.editForm, salesPost);

    this.productsCollection = this.productService.addProductToCollectionIfMissing<IProduct>(this.productsCollection, salesPost.product);
    this.appUsersSharedCollection = this.appUserService.addAppUserToCollectionIfMissing<IAppUser>(
      this.appUsersSharedCollection,
      salesPost.appUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query({ filter: 'salespost-is-null' })
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing<IProduct>(products, this.salesPost?.product)))
      .subscribe((products: IProduct[]) => (this.productsCollection = products));

    this.appUserService
      .query()
      .pipe(map((res: HttpResponse<IAppUser[]>) => res.body ?? []))
      .pipe(map((appUsers: IAppUser[]) => this.appUserService.addAppUserToCollectionIfMissing<IAppUser>(appUsers, this.salesPost?.appUser)))
      .subscribe((appUsers: IAppUser[]) => (this.appUsersSharedCollection = appUsers));
  }
}
