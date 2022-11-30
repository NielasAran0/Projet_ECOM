import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrderLineFormService } from './order-line-form.service';
import { OrderLineService } from '../service/order-line.service';
import { IOrderLine } from '../order-line.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IUserOrder } from 'app/entities/user-order/user-order.model';
import { UserOrderService } from 'app/entities/user-order/service/user-order.service';

import { OrderLineUpdateComponent } from './order-line-update.component';

describe('OrderLine Management Update Component', () => {
  let comp: OrderLineUpdateComponent;
  let fixture: ComponentFixture<OrderLineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderLineFormService: OrderLineFormService;
  let orderLineService: OrderLineService;
  let productService: ProductService;
  let userOrderService: UserOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrderLineUpdateComponent],
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
      .overrideTemplate(OrderLineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderLineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderLineFormService = TestBed.inject(OrderLineFormService);
    orderLineService = TestBed.inject(OrderLineService);
    productService = TestBed.inject(ProductService);
    userOrderService = TestBed.inject(UserOrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const orderLine: IOrderLine = { id: 456 };
      const product: IProduct = { id: 63374 };
      orderLine.product = product;

      const productCollection: IProduct[] = [{ id: 30020 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(
        productCollection,
        ...additionalProducts.map(expect.objectContaining)
      );
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserOrder query and add missing value', () => {
      const orderLine: IOrderLine = { id: 456 };
      const userOrder: IUserOrder = { id: 62525 };
      orderLine.userOrder = userOrder;

      const userOrderCollection: IUserOrder[] = [{ id: 17993 }];
      jest.spyOn(userOrderService, 'query').mockReturnValue(of(new HttpResponse({ body: userOrderCollection })));
      const additionalUserOrders = [userOrder];
      const expectedCollection: IUserOrder[] = [...additionalUserOrders, ...userOrderCollection];
      jest.spyOn(userOrderService, 'addUserOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      expect(userOrderService.query).toHaveBeenCalled();
      expect(userOrderService.addUserOrderToCollectionIfMissing).toHaveBeenCalledWith(
        userOrderCollection,
        ...additionalUserOrders.map(expect.objectContaining)
      );
      expect(comp.userOrdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const orderLine: IOrderLine = { id: 456 };
      const product: IProduct = { id: 19186 };
      orderLine.product = product;
      const userOrder: IUserOrder = { id: 36271 };
      orderLine.userOrder = userOrder;

      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.userOrdersSharedCollection).toContain(userOrder);
      expect(comp.orderLine).toEqual(orderLine);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderLine>>();
      const orderLine = { id: 123 };
      jest.spyOn(orderLineFormService, 'getOrderLine').mockReturnValue(orderLine);
      jest.spyOn(orderLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderLine }));
      saveSubject.complete();

      // THEN
      expect(orderLineFormService.getOrderLine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderLineService.update).toHaveBeenCalledWith(expect.objectContaining(orderLine));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderLine>>();
      const orderLine = { id: 123 };
      jest.spyOn(orderLineFormService, 'getOrderLine').mockReturnValue({ id: null });
      jest.spyOn(orderLineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderLine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderLine }));
      saveSubject.complete();

      // THEN
      expect(orderLineFormService.getOrderLine).toHaveBeenCalled();
      expect(orderLineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderLine>>();
      const orderLine = { id: 123 };
      jest.spyOn(orderLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderLineService.update).toHaveBeenCalled();
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

    describe('compareUserOrder', () => {
      it('Should forward to userOrderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userOrderService, 'compareUserOrder');
        comp.compareUserOrder(entity, entity2);
        expect(userOrderService.compareUserOrder).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
