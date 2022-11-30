import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sales-post.test-samples';

import { SalesPostFormService } from './sales-post-form.service';

describe('SalesPost Form Service', () => {
  let service: SalesPostFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesPostFormService);
  });

  describe('Service methods', () => {
    describe('createSalesPostFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSalesPostFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            stock: expect.any(Object),
            price: expect.any(Object),
            limitDate: expect.any(Object),
            sells: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });

      it('passing ISalesPost should create a new form with FormGroup', () => {
        const formGroup = service.createSalesPostFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            stock: expect.any(Object),
            price: expect.any(Object),
            limitDate: expect.any(Object),
            sells: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });
    });

    describe('getSalesPost', () => {
      it('should return NewSalesPost for default SalesPost initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSalesPostFormGroup(sampleWithNewData);

        const salesPost = service.getSalesPost(formGroup) as any;

        expect(salesPost).toMatchObject(sampleWithNewData);
      });

      it('should return NewSalesPost for empty SalesPost initial value', () => {
        const formGroup = service.createSalesPostFormGroup();

        const salesPost = service.getSalesPost(formGroup) as any;

        expect(salesPost).toMatchObject({});
      });

      it('should return ISalesPost', () => {
        const formGroup = service.createSalesPostFormGroup(sampleWithRequiredData);

        const salesPost = service.getSalesPost(formGroup) as any;

        expect(salesPost).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISalesPost should not enable id FormControl', () => {
        const formGroup = service.createSalesPostFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSalesPost should disable id FormControl', () => {
        const formGroup = service.createSalesPostFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
