import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IUserOrder } from '../user-order.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-order.test-samples';

import { UserOrderService, RestUserOrder } from './user-order.service';

const requireRestSample: RestUserOrder = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('UserOrder Service', () => {
  let service: UserOrderService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserOrder | IUserOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a UserOrder', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userOrder = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserOrder', () => {
      const userOrder = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserOrder', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserOrder', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserOrder', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserOrderToCollectionIfMissing', () => {
      it('should add a UserOrder to an empty array', () => {
        const userOrder: IUserOrder = sampleWithRequiredData;
        expectedResult = service.addUserOrderToCollectionIfMissing([], userOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userOrder);
      });

      it('should not add a UserOrder to an array that contains it', () => {
        const userOrder: IUserOrder = sampleWithRequiredData;
        const userOrderCollection: IUserOrder[] = [
          {
            ...userOrder,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserOrderToCollectionIfMissing(userOrderCollection, userOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserOrder to an array that doesn't contain it", () => {
        const userOrder: IUserOrder = sampleWithRequiredData;
        const userOrderCollection: IUserOrder[] = [sampleWithPartialData];
        expectedResult = service.addUserOrderToCollectionIfMissing(userOrderCollection, userOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userOrder);
      });

      it('should add only unique UserOrder to an array', () => {
        const userOrderArray: IUserOrder[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userOrderCollection: IUserOrder[] = [sampleWithRequiredData];
        expectedResult = service.addUserOrderToCollectionIfMissing(userOrderCollection, ...userOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userOrder: IUserOrder = sampleWithRequiredData;
        const userOrder2: IUserOrder = sampleWithPartialData;
        expectedResult = service.addUserOrderToCollectionIfMissing([], userOrder, userOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userOrder);
        expect(expectedResult).toContain(userOrder2);
      });

      it('should accept null and undefined values', () => {
        const userOrder: IUserOrder = sampleWithRequiredData;
        expectedResult = service.addUserOrderToCollectionIfMissing([], null, userOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userOrder);
      });

      it('should return initial array if no UserOrder is added', () => {
        const userOrderCollection: IUserOrder[] = [sampleWithRequiredData];
        expectedResult = service.addUserOrderToCollectionIfMissing(userOrderCollection, undefined, null);
        expect(expectedResult).toEqual(userOrderCollection);
      });
    });

    describe('compareUserOrder', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserOrder(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserOrder(entity1, entity2);
        const compareResult2 = service.compareUserOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserOrder(entity1, entity2);
        const compareResult2 = service.compareUserOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserOrder(entity1, entity2);
        const compareResult2 = service.compareUserOrder(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
