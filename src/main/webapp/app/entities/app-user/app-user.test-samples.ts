import { IAppUser, NewAppUser } from './app-user.model';

export const sampleWithRequiredData: IAppUser = {
  id: 1883,
};

export const sampleWithPartialData: IAppUser = {
  id: 30698,
  telephone: '744-737-9096 x047',
  adresse: 'toolset',
};

export const sampleWithFullData: IAppUser = {
  id: 53044,
  telephone: '994-200-4741 x0457',
  adresse: 'monitor',
};

export const sampleWithNewData: NewAppUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
