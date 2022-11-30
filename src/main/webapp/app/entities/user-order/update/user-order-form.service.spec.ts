import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-order.test-samples';

import { UserOrderFormService } from './user-order-form.service';

describe('UserOrder Form Service', () => {
  let service: UserOrderFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserOrderFormService);
  });

  describe('Service methods', () => {
    describe('createUserOrderFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserOrderFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalPrice: expect.any(Object),
            discount: expect.any(Object),
            state: expect.any(Object),
            date: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });

      it('passing IUserOrder should create a new form with FormGroup', () => {
        const formGroup = service.createUserOrderFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalPrice: expect.any(Object),
            discount: expect.any(Object),
            state: expect.any(Object),
            date: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });
    });

    describe('getUserOrder', () => {
      it('should return NewUserOrder for default UserOrder initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserOrderFormGroup(sampleWithNewData);

        const userOrder = service.getUserOrder(formGroup) as any;

        expect(userOrder).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserOrder for empty UserOrder initial value', () => {
        const formGroup = service.createUserOrderFormGroup();

        const userOrder = service.getUserOrder(formGroup) as any;

        expect(userOrder).toMatchObject({});
      });

      it('should return IUserOrder', () => {
        const formGroup = service.createUserOrderFormGroup(sampleWithRequiredData);

        const userOrder = service.getUserOrder(formGroup) as any;

        expect(userOrder).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserOrder should not enable id FormControl', () => {
        const formGroup = service.createUserOrderFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserOrder should disable id FormControl', () => {
        const formGroup = service.createUserOrderFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
