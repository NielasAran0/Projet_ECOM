import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SalesPostFormService } from './sales-post-form.service';
import { SalesPostService } from '../service/sales-post.service';
import { ISalesPost } from '../sales-post.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { AppUserService } from 'app/entities/app-user/service/app-user.service';

import { SalesPostUpdateComponent } from './sales-post-update.component';

describe('SalesPost Management Update Component', () => {
  let comp: SalesPostUpdateComponent;
  let fixture: ComponentFixture<SalesPostUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let salesPostFormService: SalesPostFormService;
  let salesPostService: SalesPostService;
  let productService: ProductService;
  let appUserService: AppUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SalesPostUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SalesPostUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalesPostUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    salesPostFormService = TestBed.inject(SalesPostFormService);
    salesPostService = TestBed.inject(SalesPostService);
    productService = TestBed.inject(ProductService);
    appUserService = TestBed.inject(AppUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call product query and add missing value', () => {
      const salesPost: ISalesPost = { id: 456 };
      const product: IProduct = { id: 74582 };
      salesPost.product = product;

      const productCollection: IProduct[] = [{ id: 15859 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const expectedCollection: IProduct[] = [product, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ salesPost });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, product);
      expect(comp.productsCollection).toEqual(expectedCollection);
    });

    it('Should call AppUser query and add missing value', () => {
      const salesPost: ISalesPost = { id: 456 };
      const appUser: IAppUser = { id: 96068 };
      salesPost.appUser = appUser;

      const appUserCollection: IAppUser[] = [{ id: 57300 }];
      jest.spyOn(appUserService, 'query').mockReturnValue(of(new HttpResponse({ body: appUserCollection })));
      const additionalAppUsers = [appUser];
      const expectedCollection: IAppUser[] = [...additionalAppUsers, ...appUserCollection];
      jest.spyOn(appUserService, 'addAppUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ salesPost });
      comp.ngOnInit();

      expect(appUserService.query).toHaveBeenCalled();
      expect(appUserService.addAppUserToCollectionIfMissing).toHaveBeenCalledWith(
        appUserCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const salesPost: ISalesPost = { id: 456 };
      const product: IProduct = { id: 17393 };
      salesPost.product = product;
      const appUser: IAppUser = { id: 2212 };
      salesPost.appUser = appUser;

      activatedRoute.data = of({ salesPost });
      comp.ngOnInit();

      expect(comp.productsCollection).toContain(product);
      expect(comp.appUsersSharedCollection).toContain(appUser);
      expect(comp.salesPost).toEqual(salesPost);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISalesPost>>();
      const salesPost = { id: 123 };
      jest.spyOn(salesPostFormService, 'getSalesPost').mockReturnValue(salesPost);
      jest.spyOn(salesPostService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salesPost });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: salesPost }));
      saveSubject.complete();

      // THEN
      expect(salesPostFormService.getSalesPost).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(salesPostService.update).toHaveBeenCalledWith(expect.objectContaining(salesPost));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISalesPost>>();
      const salesPost = { id: 123 };
      jest.spyOn(salesPostFormService, 'getSalesPost').mockReturnValue({ id: null });
      jest.spyOn(salesPostService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salesPost: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: salesPost }));
      saveSubject.complete();

      // THEN
      expect(salesPostFormService.getSalesPost).toHaveBeenCalled();
      expect(salesPostService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISalesPost>>();
      const salesPost = { id: 123 };
      jest.spyOn(salesPostService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salesPost });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(salesPostService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProduct', () => {
      it('Should forward to productService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productService, 'compareProduct');
        comp.compareProduct(entity, entity2);
        expect(productService.compareProduct).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAppUser', () => {
      it('Should forward to appUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(appUserService, 'compareAppUser');
        comp.compareAppUser(entity, entity2);
        expect(appUserService.compareAppUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
