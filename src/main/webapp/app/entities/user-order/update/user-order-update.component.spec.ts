import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserOrderFormService } from './user-order-form.service';
import { UserOrderService } from '../service/user-order.service';
import { IUserOrder } from '../user-order.model';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { AppUserService } from 'app/entities/app-user/service/app-user.service';

import { UserOrderUpdateComponent } from './user-order-update.component';

describe('UserOrder Management Update Component', () => {
  let comp: UserOrderUpdateComponent;
  let fixture: ComponentFixture<UserOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userOrderFormService: UserOrderFormService;
  let userOrderService: UserOrderService;
  let appUserService: AppUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserOrderUpdateComponent],
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
      .overrideTemplate(UserOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userOrderFormService = TestBed.inject(UserOrderFormService);
    userOrderService = TestBed.inject(UserOrderService);
    appUserService = TestBed.inject(AppUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AppUser query and add missing value', () => {
      const userOrder: IUserOrder = { id: 456 };
      const appUser: IAppUser = { id: 25900 };
      userOrder.appUser = appUser;

      const appUserCollection: IAppUser[] = [{ id: 34542 }];
      jest.spyOn(appUserService, 'query').mockReturnValue(of(new HttpResponse({ body: appUserCollection })));
      const additionalAppUsers = [appUser];
      const expectedCollection: IAppUser[] = [...additionalAppUsers, ...appUserCollection];
      jest.spyOn(appUserService, 'addAppUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userOrder });
      comp.ngOnInit();

      expect(appUserService.query).toHaveBeenCalled();
      expect(appUserService.addAppUserToCollectionIfMissing).toHaveBeenCalledWith(
        appUserCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userOrder: IUserOrder = { id: 456 };
      const appUser: IAppUser = { id: 95837 };
      userOrder.appUser = appUser;

      activatedRoute.data = of({ userOrder });
      comp.ngOnInit();

      expect(comp.appUsersSharedCollection).toContain(appUser);
      expect(comp.userOrder).toEqual(userOrder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserOrder>>();
      const userOrder = { id: 123 };
      jest.spyOn(userOrderFormService, 'getUserOrder').mockReturnValue(userOrder);
      jest.spyOn(userOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userOrder }));
      saveSubject.complete();

      // THEN
      expect(userOrderFormService.getUserOrder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userOrderService.update).toHaveBeenCalledWith(expect.objectContaining(userOrder));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserOrder>>();
      const userOrder = { id: 123 };
      jest.spyOn(userOrderFormService, 'getUserOrder').mockReturnValue({ id: null });
      jest.spyOn(userOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userOrder: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userOrder }));
      saveSubject.complete();

      // THEN
      expect(userOrderFormService.getUserOrder).toHaveBeenCalled();
      expect(userOrderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserOrder>>();
      const userOrder = { id: 123 };
      jest.spyOn(userOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userOrderService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
