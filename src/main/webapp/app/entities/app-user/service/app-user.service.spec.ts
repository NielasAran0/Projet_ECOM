import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAppUser } from '../app-user.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../app-user.test-samples';

import { AppUserService } from './app-user.service';

const requireRestSample: IAppUser = {
  ...sampleWithRequiredData,
};

describe('AppUser Service', () => {
  let service: AppUserService;
  let httpMock: HttpTestingController;
  let expectedResult: IAppUser | IAppUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AppUserService);
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

    it('should create a AppUser', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const appUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(appUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AppUser', () => {
      const appUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(appUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AppUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AppUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AppUser', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAppUserToCollectionIfMissing', () => {
      it('should add a AppUser to an empty array', () => {
        const appUser: IAppUser = sampleWithRequiredData;
        expectedResult = service.addAppUserToCollectionIfMissing([], appUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appUser);
      });

      it('should not add a AppUser to an array that contains it', () => {
        const appUser: IAppUser = sampleWithRequiredData;
        const appUserCollection: IAppUser[] = [
          {
            ...appUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAppUserToCollectionIfMissing(appUserCollection, appUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AppUser to an array that doesn't contain it", () => {
        const appUser: IAppUser = sampleWithRequiredData;
        const appUserCollection: IAppUser[] = [sampleWithPartialData];
        expectedResult = service.addAppUserToCollectionIfMissing(appUserCollection, appUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appUser);
      });

      it('should add only unique AppUser to an array', () => {
        const appUserArray: IAppUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const appUserCollection: IAppUser[] = [sampleWithRequiredData];
        expectedResult = service.addAppUserToCollectionIfMissing(appUserCollection, ...appUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const appUser: IAppUser = sampleWithRequiredData;
        const appUser2: IAppUser = sampleWithPartialData;
        expectedResult = service.addAppUserToCollectionIfMissing([], appUser, appUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appUser);
        expect(expectedResult).toContain(appUser2);
      });

      it('should accept null and undefined values', () => {
        const appUser: IAppUser = sampleWithRequiredData;
        expectedResult = service.addAppUserToCollectionIfMissing([], null, appUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appUser);
      });

      it('should return initial array if no AppUser is added', () => {
        const appUserCollection: IAppUser[] = [sampleWithRequiredData];
        expectedResult = service.addAppUserToCollectionIfMissing(appUserCollection, undefined, null);
        expect(expectedResult).toEqual(appUserCollection);
      });
    });

    describe('compareAppUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAppUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAppUser(entity1, entity2);
        const compareResult2 = service.compareAppUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAppUser(entity1, entity2);
        const compareResult2 = service.compareAppUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAppUser(entity1, entity2);
        const compareResult2 = service.compareAppUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
