import { IAppUser, NewAppUser } from './app-user.model';

export const sampleWithRequiredData: IAppUser = {
  id: 1883,
};

export const sampleWithPartialData: IAppUser = {
  id: 49456,
  email: 'Fay.Satterfield90@yahoo.com',
  firstName: 'Maryam',
  telephone: '571-491-5689',
};

export const sampleWithFullData: IAppUser = {
  id: 45462,
  email: 'Alana_Batz@gmail.com',
  firstName: 'Hal',
  lastName: 'Crona',
  password: 'Mountains',
  telephone: '(777) 560-2884',
  adresse: 'violet white',
};

export const sampleWithNewData: NewAppUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
