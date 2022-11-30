import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISalesPost } from '../sales-post.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sales-post.test-samples';

import { SalesPostService, RestSalesPost } from './sales-post.service';

const requireRestSample: RestSalesPost = {
  ...sampleWithRequiredData,
  limitDate: sampleWithRequiredData.limitDate?.format(DATE_FORMAT),
};

describe('SalesPost Service', () => {
  let service: SalesPostService;
  let httpMock: HttpTestingController;
  let expectedResult: ISalesPost | ISalesPost[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SalesPostService);
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

    it('should create a SalesPost', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const salesPost = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(salesPost).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SalesPost', () => {
      const salesPost = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(salesPost).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SalesPost', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SalesPost', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SalesPost', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSalesPostToCollectionIfMissing', () => {
      it('should add a SalesPost to an empty array', () => {
        const salesPost: ISalesPost = sampleWithRequiredData;
        expectedResult = service.addSalesPostToCollectionIfMissing([], salesPost);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(salesPost);
      });

      it('should not add a SalesPost to an array that contains it', () => {
        const salesPost: ISalesPost = sampleWithRequiredData;
        const salesPostCollection: ISalesPost[] = [
          {
            ...salesPost,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSalesPostToCollectionIfMissing(salesPostCollection, salesPost);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SalesPost to an array that doesn't contain it", () => {
        const salesPost: ISalesPost = sampleWithRequiredData;
        const salesPostCollection: ISalesPost[] = [sampleWithPartialData];
        expectedResult = service.addSalesPostToCollectionIfMissing(salesPostCollection, salesPost);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(salesPost);
      });

      it('should add only unique SalesPost to an array', () => {
        const salesPostArray: ISalesPost[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const salesPostCollection: ISalesPost[] = [sampleWithRequiredData];
        expectedResult = service.addSalesPostToCollectionIfMissing(salesPostCollection, ...salesPostArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const salesPost: ISalesPost = sampleWithRequiredData;
        const salesPost2: ISalesPost = sampleWithPartialData;
        expectedResult = service.addSalesPostToCollectionIfMissing([], salesPost, salesPost2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(salesPost);
        expect(expectedResult).toContain(salesPost2);
      });

      it('should accept null and undefined values', () => {
        const salesPost: ISalesPost = sampleWithRequiredData;
        expectedResult = service.addSalesPostToCollectionIfMissing([], null, salesPost, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(salesPost);
      });

      it('should return initial array if no SalesPost is added', () => {
        const salesPostCollection: ISalesPost[] = [sampleWithRequiredData];
        expectedResult = service.addSalesPostToCollectionIfMissing(salesPostCollection, undefined, null);
        expect(expectedResult).toEqual(salesPostCollection);
      });
    });

    describe('compareSalesPost', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSalesPost(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSalesPost(entity1, entity2);
        const compareResult2 = service.compareSalesPost(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSalesPost(entity1, entity2);
        const compareResult2 = service.compareSalesPost(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSalesPost(entity1, entity2);
        const compareResult2 = service.compareSalesPost(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
